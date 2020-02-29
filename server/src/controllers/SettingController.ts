import { query, querySelectAll } from "../common/query"
import { Setting } from "../dtos/Setting.dto";
import { now } from "moment";

export const Settings: Setting[] = [];

export const getSetting = async (name: string, defaultValue?: string | number | boolean): Promise<Setting> => {
    const cachedSetting = Settings.find(s => s.name === name);
    if (cachedSetting) {
        if (cachedSetting.cachedTime + 1000*60*60 > now()) {
            return cachedSetting;
        }
        removeFromCache(name);
    }
    // TODO: Caching settings with timelimit
    const setting = await querySelectAll(Setting, { name }) as Setting[];
    if (setting.length == 1) {
        Settings.push(setting[0]);
        return setting[0];
    } else {
        return new Setting(name, '');
    }
}

export const setSetting = async (name: string, value: string | number | boolean) => {
    const setting = await getSetting(name);
    if (!setting.value) {
        await query('INSERT INTO `settings` VALUES (?, ?)', [name, value.toString()]);
    } else {
        await query('UPDATE `settings` SET `value` = ? WHERE `name` = ?', [value, name.toString()]);
    }
    removeFromCache(name);
}

const removeFromCache = (name: string) => {
    const index = Settings.findIndex(s => s.name == name);
    Settings.splice(index, 1);
}