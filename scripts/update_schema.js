const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Rename Stadium to Venue
schema = schema.replace(/model Stadium \{/g, 'model Venue {');
schema = schema.replace(/stadiums\s+Stadium\[\]/g, 'venues Venue[]');
schema = schema.replace(/stadium\s+Stadium\?/g, 'venue Venue?');
schema = schema.replace(/stadium\s+Stadium/g, 'venue Venue');
schema = schema.replace(/stadiumId/g, 'venueId');
schema = schema.replace(/stadium_id/g, 'venue_id');
schema = schema.replace(/@@map\("stadiums"\)/g, '@@map("venues")');

// 2. Rename CrowdData to CrowdSnapshot
schema = schema.replace(/model CrowdData \{/g, 'model CrowdSnapshot {');
schema = schema.replace(/crowdData\s+CrowdData\[\]/g, 'crowdSnapshots CrowdSnapshot[]');
schema = schema.replace(/@@map\("crowd_data"\)/g, '@@map("crowd_snapshots")');

// 3. (Skipped automatic deletedAt injection, will do manually)

// 4. Add missing models
const newModels = `
// ==========================================
// Phase 17 Sprint 2 New Models
// ==========================================

model Role {
  id             String       @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String       @map("organization_id") @db.Uuid
  name           String
  description    String?
  isSystem       Boolean      @default(false) @map("is_system")
  deletedAt      DateTime?    @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime     @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime     @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  permissions    Permission[]

  @@unique([organizationId, name])
  @@index([organizationId])
  @@map("roles")
}

model Permission {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  roleId         String    @map("role_id") @db.Uuid
  resource       String    // e.g. "MATCH", "INCIDENT"
  action         String    // e.g. "CREATE", "READ", "UPDATE", "DELETE"
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  role           Role         @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([roleId, resource, action])
  @@index([organizationId])
  @@map("permissions")
}

model MobilitySnapshot {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  matchId        String    @map("match_id") @db.Uuid
  venueId        String    @map("venue_id") @db.Uuid
  transitMode    String    @map("transit_mode") // "metro", "bus", "car"
  passengerCount Int       @map("passenger_count")
  delayMinutes   Int       @default(0) @map("delay_minutes")
  status         String    @default("operational")
  capturedAt     DateTime  @map("captured_at") @db.Timestamptz(6)
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  match          Match        @relation(fields: [matchId], references: [id], onDelete: Cascade)
  venue          Venue        @relation(fields: [venueId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([matchId, capturedAt(sort: Desc)])
  @@map("mobility_snapshots")
}

model Camera {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  venueId        String    @map("venue_id") @db.Uuid
  zoneId         String?   @map("zone_id") @db.Uuid
  name           String
  streamUrl      String    @map("stream_url")
  type           String    @default("ptz")
  status         String    @default("active")
  metadata       Json      @default("{}")
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  venue          Venue        @relation(fields: [venueId], references: [id], onDelete: Cascade)
  zone           Zone?        @relation(fields: [zoneId], references: [id], onDelete: Cascade)
  events         CameraEvent[]

  @@index([organizationId])
  @@index([venueId])
  @@map("cameras")
}

model CameraEvent {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  cameraId       String    @map("camera_id") @db.Uuid
  matchId        String?   @map("match_id") @db.Uuid
  eventType      String    @map("event_type") // "motion", "crowd_anomaly"
  severity       Int       @default(0)
  snapshotUrl    String?   @map("snapshot_url")
  metadata       Json      @default("{}")
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  camera         Camera       @relation(fields: [cameraId], references: [id], onDelete: Cascade)
  match          Match?       @relation(fields: [matchId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([cameraId, createdAt(sort: Desc)])
  @@map("camera_events")
}

model WorkforceUnit {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  venueId        String    @map("venue_id") @db.Uuid
  name           String
  type           String    // "medical", "security", "steward"
  status         String    @default("available")
  contactInfo    String?   @map("contact_info")
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  venue          Venue        @relation(fields: [venueId], references: [id], onDelete: Cascade)
  deployments    Deployment[]

  @@index([organizationId])
  @@index([venueId, type])
  @@map("workforce_units")
}

model Deployment {
  id               String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId   String    @map("organization_id") @db.Uuid
  matchId          String    @map("match_id") @db.Uuid
  workforceUnitId  String    @map("workforce_unit_id") @db.Uuid
  zoneId           String?   @map("zone_id") @db.Uuid
  assignedTasks    Json      @default("[]") @map("assigned_tasks")
  status           String    @default("active")
  deployedAt       DateTime  @default(now()) @map("deployed_at") @db.Timestamptz(6)
  endedAt          DateTime? @map("ended_at") @db.Timestamptz(6)
  deletedAt        DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt        DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt        DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization     Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  match            Match         @relation(fields: [matchId], references: [id], onDelete: Cascade)
  workforceUnit    WorkforceUnit @relation(fields: [workforceUnitId], references: [id], onDelete: Cascade)
  zone             Zone?         @relation(fields: [zoneId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([matchId, status])
  @@map("deployments")
}

model ReportFile {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  reportId       String    @map("report_id") @db.Uuid
  fileName       String    @map("file_name")
  fileSize       Int       @map("file_size")
  mimeType       String    @map("mime_type") // "application/pdf", "text/csv"
  storageKey     String    @map("storage_key")
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  report         Report       @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([reportId])
  @@map("report_files")
}

model SystemMetric {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  metricName     String    @map("metric_name")
  value          Decimal   @db.Decimal(10, 4)
  unit           String
  tags           Json      @default("{}")
  capturedAt     DateTime  @map("captured_at") @db.Timestamptz(6)
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([metricName, capturedAt(sort: Desc)])
  @@map("system_metrics")
}

model InfrastructureNode {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  venueId        String    @map("venue_id") @db.Uuid
  name           String
  type           String    // "server", "switch", "router"
  ipAddress      String?   @map("ip_address")
  status         String    @default("online")
  metadata       Json      @default("{}")
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  venue          Venue        @relation(fields: [venueId], references: [id], onDelete: Cascade)
  metrics        InfrastructureMetric[]

  @@index([organizationId])
  @@index([venueId])
  @@map("infrastructure_nodes")
}

model InfrastructureMetric {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  nodeId         String    @map("node_id") @db.Uuid
  cpuUsage       Decimal?  @map("cpu_usage") @db.Decimal(5, 2)
  memoryUsage    Decimal?  @map("memory_usage") @db.Decimal(5, 2)
  networkIn      Int?      @map("network_in") // bytes
  networkOut     Int?      @map("network_out") // bytes
  capturedAt     DateTime  @map("captured_at") @db.Timestamptz(6)
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  node           InfrastructureNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([nodeId, capturedAt(sort: Desc)])
  @@map("infrastructure_metrics")
}

model Device {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  userId         String?   @map("user_id") @db.Uuid
  deviceId       String    @unique @map("device_id")
  deviceType     String    @map("device_type") // "ios", "android", "web"
  pushToken      String?   @map("push_token")
  lastActiveAt   DateTime? @map("last_active_at") @db.Timestamptz(6)
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User?        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([userId])
  @@map("devices")
}

model ApiKey {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  name           String
  keyHash        String    @map("key_hash")
  lastUsedAt     DateTime? @map("last_used_at") @db.Timestamptz(6)
  expiresAt      DateTime? @map("expires_at") @db.Timestamptz(6)
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@map("api_keys")
}

model Backup {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  status         String    @default("pending") // "pending", "completed", "failed"
  storageKey     String?   @map("storage_key")
  fileSize       Int?      @map("file_size")
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@map("backups")
}

model Policy {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  name           String
  description    String?
  rules          Json      @default("[]")
  isActive       Boolean   @default(true) @map("is_active")
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@map("policies")
}

model Certificate {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  domain         String
  validFrom      DateTime  @map("valid_from") @db.Timestamptz(6)
  validTo        DateTime  @map("valid_to") @db.Timestamptz(6)
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@map("certificates")
}

model StorageBucket {
  id             String    @id @default(dbgenerated("uuid_generated_v4()")) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  name           String
  provider       String    // "s3", "local", "supabase"
  config         Json      @default("{}")
  isPublic       Boolean   @default(false) @map("is_public")
  deletedAt      DateTime? @map("deleted_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@map("storage_buckets")
}
`;

schema += newModels;

// Fix Organization relations to include all new models using plain JS string (no backticks)
const orgRelations = '  users          User[]\n' +
  '  matches        Match[]\n' +
  '  venues         Venue[]\n' +
  '  auditLogs      AuditLog[]\n' +
  '  roles          Role[]\n' +
  '  permissions    Permission[]\n' +
  '  mobilitySnapshots MobilitySnapshot[]\n' +
  '  cameras        Camera[]\n' +
  '  cameraEvents   CameraEvent[]\n' +
  '  workforceUnits WorkforceUnit[]\n' +
  '  deployments    Deployment[]\n' +
  '  reportFiles    ReportFile[]\n' +
  '  systemMetrics  SystemMetric[]\n' +
  '  infraNodes     InfrastructureNode[]\n' +
  '  infraMetrics   InfrastructureMetric[]\n' +
  '  devices        Device[]\n' +
  '  apiKeys        ApiKey[]\n' +
  '  backups        Backup[]\n' +
  '  policies       Policy[]\n' +
  '  certificates   Certificate[]\n' +
  '  storageBuckets StorageBucket[]';

schema = schema.replace(
  /users\s+User\[\]\n\s+matches\s+Match\[\]\n\s+stadiums\s+Stadium\[\]\n\s+auditLogs\s+AuditLog\[\]/,
  orgRelations
);

// Add organizationId and relation to Report
schema = schema.replace(
  /(model Report \{)/g,
  '$1\n  organizationId String? @map("organization_id") @db.Uuid'
);

schema = schema.replace(
  /(model Report \{[\s\S]*?)(@@map)/g,
  '$1  organization Organization? @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  $2'
);

// Add reports to Organization
schema = schema.replace(
  /(model Organization \{[\s\S]*?)(@@map)/g,
  '$1  reports Report[]\n  $2'
);

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Schema updated successfully');
