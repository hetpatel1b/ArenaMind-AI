import { Prisma } from '@prisma/client';
import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { settingRepository } from './repository';
import { toSettingDto } from './mapper';
import { SettingDto, UpdateSettingDto } from './dto';
import { prisma } from '@/lib/db/client';

export class SettingService extends BaseService {
  constructor() {
    super('SettingService');
  }

  async getStadiumSettings(ctx: BusinessContext): Promise<SettingDto[]> {
    return this.execute('getStadiumSettings', ctx, async () => {
      // Allow global settings (venueId = null) and specific venue settings
      const { data } = await settingRepository.findAll({
        filter: {
          OR: [{ venueId: ctx.venueId }, { venueId: null }],
        },
      });

      return data.map(toSettingDto);
    });
  }

  async updateSetting(ctx: BusinessContext, payload: UpdateSettingDto): Promise<SettingDto> {
    return this.execute('updateSetting', ctx, async () => {
      const updatedSetting = await prisma.$transaction(async (tx) => {
        let setting = await tx.systemSetting.findFirst({
          where: { key: payload.key, venueId: ctx.venueId },
        });

        if (setting) {
          setting = await tx.systemSetting.update({
            where: { id: setting.id },
            data: { value: payload.value as Prisma.InputJsonValue },
          });
        } else {
          setting = await tx.systemSetting.create({
            data: {
              venueId: ctx.venueId,
              key: payload.key,
              value: payload.value as Prisma.InputJsonValue,
            },
          });
        }

        await tx.auditLog.create({
          data: {
            recordId: setting.id,
            tableName: 'unknown',
            action: 'UPDATE_SYSTEM_SETTING',
          },
        });

        return setting;
      });

      return toSettingDto(updatedSetting);
    });
  }
}

export const settingService = new SettingService();
