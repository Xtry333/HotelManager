import { query, querySelectAll } from "../js/query"
import { Setting } from "../dtos/Setting.dto";

export const Settings: Setting[] = [];

export const getSetting = async (name: string): Promise<Setting> => {
    const cached = Settings.find(s => s.name === name);
    if (cached) {
        return cached;
    }
    //TODO: Caching settings
    //const setting = await query('SELECT `value` FROM `settings` WHERE `name` = ?', [name]) as Setting[];
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
}