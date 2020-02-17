import { expect } from 'chai';
import * as Validator from '../js/validator';

describe('Validator', () => {
    it('correctly validates isEmpty', () => {
        expect(Validator.isEmpty(undefined as any)).to.be.true;
        expect(Validator.isEmpty(null as any)).to.be.true;
        expect(Validator.isEmpty('')).to.be.true;
        expect(Validator.isEmpty('stuff')).to.be.false;
        expect(Validator.isEmpty('a')).to.be.false;
    });

    it('correctly validates Email', () => {
        expect(Validator.validateEmail('e@mail.com')).to.be.true;
        expect(Validator.validateEmail('mailer@mmmmail.pl')).to.be.true;

        expect(Validator.validateEmail('e@mail.')).to.be.false;
        expect(Validator.validateEmail('@mmmmail.pl')).to.be.false;
        expect(Validator.validateEmail('iamamail.com')).to.be.false;
    });

    it('correctly checks length of string', () => {
        const length = {min: 3, max: 8};
        expect(Validator.validateLength('a cookie', length)).to.be.true;
        expect(Validator.validateLength('a cookiee', length)).to.be.false;
        expect(Validator.validateLength('a', length)).to.be.false;
        expect(Validator.validateLength(undefined as any, length)).to.be.false;
        expect(Validator.validateLength(null as any, length)).to.be.false;
    });
});