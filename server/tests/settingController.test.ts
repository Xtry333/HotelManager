import { expect } from 'chai';
import { getSetting, setSetting } from '../src/controllers/SettingController';
import { now } from 'moment';

describe.only('Setting Controller', () => {
    it('can get a setting from cache and update it', async () => {
        const time = now();
        await getSetting('test-setting');
        await setSetting('test-setting', time);
        expect(+(await getSetting('test-setting')).value).to.eq(time);
        await setSetting('test-setting', time - 1);
        expect(+(await getSetting('test-setting')).value).to.not.eq(time);
    });
});