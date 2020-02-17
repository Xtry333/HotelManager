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
});