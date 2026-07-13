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
      // Allow global settings (stadiumId = null) and specific stadium settings
      const { data } = await settingRepository.findAll({
        filter: {
          OR: [{ stadiumId: ctx.stadiumId }, { stadiumId: null }],
        },
      });

      return data.map(toSettingDto);
    });
  }

  async updateSetting(ctx: BusinessContext, payload: UpdateSettingDto): Promise<SettingDto> {
    return this.execute('updateSetting', ctx, async () => {
      const updatedSetting = await prisma.$transaction(async (tx) => {
        let setting = await tx.systemSetting.findFirst({
          where: { key: payload.key, stadiumId: ctx.stadiumId },
        });

        if (setting) {
          setting = await tx.systemSetting.update({
            where: { id: setting.id },
            data: { value: payload.value },
          });
        } else {
          setting = await tx.systemSetting.create({
            data: {
              stadiumId: ctx.stadiumId,
              key: payload.key,
              value: payload.value,
            },
          });
        }

        await tx.auditLog.create({
          data: {
            recordId: setting.id,
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
