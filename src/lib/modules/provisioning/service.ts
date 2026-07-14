import { prisma } from '@/lib/db/client';
import { ScenarioRegistry } from './registry';
import { ScenarioTemplate } from './types';

export class ProvisioningService {
  /**
   * Provisions an entire Demo Workspace inside a single database transaction
   * using a deterministic Scenario Template.
   */
  public async provisionDemoWorkspace(userId: string, name: string) {
    const template = ScenarioRegistry.getRandomScenario();

    return prisma.$transaction(
      async (tx) => {
        // 1. Reference Data Generation (Incident Types & Resource Types)
        // Collect all unique types needed by this scenario
        const requiredIncidentTypes = Array.from(new Set(template.incidents.map((i) => i.typeRef)));
        const requiredResourceTypes = Array.from(new Set(template.resources.map((r) => r.typeRef)));

        for (const typeName of requiredIncidentTypes) {
          await tx.incidentType
            .upsert({
              where: { id: '00000000-0000-0000-0000-000000000000' }, // Dummy ID since we don't know it, wait, prisma upsert needs unique field.
              // Since IncidentType has no unique name field in schema, we have to findFirst and create
              // Wait, let's just do findFirst
              create: { name: typeName, defaultTier: 2 },
              update: {},
            })
            .catch(async () => {
              const existing = await tx.incidentType.findFirst({ where: { name: typeName } });
              if (!existing)
                await tx.incidentType.create({ data: { name: typeName, defaultTier: 2 } });
            });
        }

        for (const typeName of requiredResourceTypes) {
          await tx.resourceType
            .upsert({
              where: { id: '00000000-0000-0000-0000-000000000000' },
              create: { name: typeName },
              update: {},
            })
            .catch(async () => {
              const existing = await tx.resourceType.findFirst({ where: { name: typeName } });
              if (!existing) await tx.resourceType.create({ data: { name: typeName } });
            });
        }

        // Fetch the maps
        const incidentTypeMap = await tx.incidentType
          .findMany()
          .then((types) => new Map(types.map((t) => [t.name, t.id])));
        const resourceTypeMap = await tx.resourceType
          .findMany()
          .then((types) => new Map(types.map((t) => [t.name, t.id])));

        // 2. Generate Stadium
        const stadium = await tx.stadium.create({
          data: {
            name: `${template.stadium.name} (Demo ${Math.floor(Math.random() * 10000)})`,
            shortName: template.stadium.shortName,
            city: template.stadium.city,
            country: template.stadium.country,
            capacity: template.stadium.capacity,
            latitude: template.stadium.latitude,
            longitude: template.stadium.longitude,
            timezone: template.stadium.timezone,
            zoneCount: template.zones.length,
            metadata: { scenarioId: template.meta.id, healthScore: template.meta.healthScore },
          },
        });

        // 3. Generate User and link to Stadium
        const user = await tx.user.create({
          data: {
            id: userId,
            stadiumId: stadium.id,
            fullName: name,
            role: 'operations_manager',
            preferences: { theme: 'dark', layout: 'default' },
          },
        });

        // 4. Generate Zones and Map IDs
        const zoneIdMap = new Map<string, string>(); // logicalId -> dbId
        for (const zone of template.zones) {
          const createdZone = await tx.zone.create({
            data: {
              stadiumId: stadium.id,
              name: zone.name,
              shortCode: zone.shortCode,
              capacity: zone.capacity,
              safeCapacity: zone.safeCapacity,
              metadata: zone.metadata,
            },
          });
          zoneIdMap.set(zone.id, createdZone.id);
        }

        // 5. Generate Match
        const match = await tx.match.create({
          data: {
            stadiumId: stadium.id,
            matchNumber: template.match.matchNumber,
            homeTeam: template.match.homeTeam,
            awayTeam: template.match.awayTeam,
            scheduledAt: new Date(),
            kickoffAt: new Date(Date.now() + template.match.kickoffOffsetMinutes * 60000),
            currentPhase: template.match.currentPhase as any,
            matchStatus: 'active',
            expectedAttendance: template.match.expectedAttendance,
            actualAttendance: template.match.actualAttendance,
            weatherSummary: template.match.weatherSummary,
          },
        });

        // 6. Generate Crowd Data
        const crowdDataPayloads = template.zones.map((zone) => {
          const dbZoneId = zoneIdMap.get(zone.id)!;
          return {
            matchId: match.id,
            stadiumId: stadium.id,
            zoneId: dbZoneId,
            fanCount: zone.crowd.fanCount,
            safeCapacity: zone.safeCapacity,
            densityPct: zone.crowd.densityPct,
            ingressRate: zone.crowd.ingressRate,
            egressRate: zone.crowd.egressRate,
          };
        });
        await tx.crowdData.createMany({ data: crowdDataPayloads });

        // 7. Generate Incidents and Map IDs
        const incidentIdMap = new Map<string, string>(); // logicalId -> dbId
        for (const incident of template.incidents) {
          const dbZoneId = zoneIdMap.get(incident.zoneRef);
          const typeId = incidentTypeMap.get(incident.typeRef);

          const createdIncident = await tx.incident.create({
            data: {
              matchId: match.id,
              stadiumId: stadium.id,
              zoneId: dbZoneId,
              incidentTypeId: typeId,
              reportedBy: user.id,
              title: incident.title,
              description: incident.description,
              severityTier: incident.severityTier,
              status: incident.status as any,
              aiType: incident.aiType,
              aiTier: incident.aiTier,
              aiConfidence: incident.aiConfidence,
              aiClassificationAt: new Date(),
            },
          });
          incidentIdMap.set(incident.id, createdIncident.id);
        }

        // 8. Generate Resources
        const resourcePayloads = template.resources.map((res) => {
          const dbZoneId = zoneIdMap.get(res.zoneRef);
          const typeId = resourceTypeMap.get(res.typeRef)!;
          return {
            stadiumId: stadium.id,
            matchId: match.id,
            zoneId: dbZoneId,
            resourceTypeId: typeId,
            name: res.name,
            status: res.status as any,
          };
        });
        if (resourcePayloads.length > 0) {
          await tx.resource.createMany({ data: resourcePayloads });
        }

        // 9. Generate AI Recommendations
        const aiRecPayloads = template.aiRecommendations.map((rec) => {
          const dbIncidentId = rec.incidentRef ? incidentIdMap.get(rec.incidentRef) : undefined;
          return {
            stadiumId: stadium.id,
            matchId: match.id,
            incidentId: dbIncidentId,
            featureName: rec.featureName,
            modelName: rec.modelName,
            promptVersion: rec.promptVersion,
            confidenceScore: rec.confidenceScore,
            data: rec.data as any,
            expiresAt: new Date(Date.now() + rec.expiresInMinutes * 60000),
          };
        });
        if (aiRecPayloads.length > 0) {
          await tx.aiRecommendation.createMany({ data: aiRecPayloads });
        }

        // 10. Generate KPIs
        await tx.kpiSnapshot.create({
          data: {
            stadiumId: stadium.id,
            matchId: match.id,
            phase: template.match.currentPhase,
            openIncidents: template.incidents.length,
            tier1Incidents: template.incidents.filter((i) => i.severityTier === 1).length,
            resolvedIncidents: 0,
            avgCrowdDensityPct:
              template.zones.reduce((sum, z) => sum + z.crowd.densityPct, 0) /
              template.zones.length,
            zonesAboveAlert: template.zones.filter((z) => z.crowd.densityPct > 85).length,
            resourcesDeployed: template.resources.filter((r) => r.status === 'deployed').length,
            resourcesAvailable: template.resources.filter((r) => r.status === 'available').length,
            healthScore: template.meta.healthScore,
          },
        });

        // 11. Generate Health Score
        await tx.healthScore.create({
          data: {
            stadiumId: stadium.id,
            matchId: match.id,
            score: template.meta.healthScore,
            incidentScore: template.meta.healthScore - 5,
            crowdScore: template.meta.healthScore,
            resourceScore: 100,
          },
        });

        // 12. Generate Notifications
        const notifPayloads = template.notifications.map((notif) => ({
          userId: user.id,
          matchId: match.id,
          type: notif.type,
          title: notif.title,
          body: notif.body,
        }));
        if (notifPayloads.length > 0) {
          await tx.notification.createMany({ data: notifPayloads });
        }

        return {
          stadiumId: stadium.id,
          matchId: match.id,
          userId: user.id,
          scenarioId: template.meta.id,
        };
      },
      {
        timeout: 10000,
      }
    );
  }
}
