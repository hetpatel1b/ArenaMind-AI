import { SystemSetting } from '@prisma/client';
import { SettingDto } from './dto';

export function toSettingDto(setting: SystemSetting): SettingDto {
  return {
    id: setting.id,
    key: setting.key,
    value: setting.value,
  };
}
