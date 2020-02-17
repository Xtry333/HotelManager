import { expect } from 'chai';
import * as Validator from '../js/validator';

describe('Validator', () => {
    it('returns true when email is correct', () => {
        expect(Validator.validateEmail('e@mail.com')).to.be.true;
        expect(Validator.validateEmail('mailer@mmmmail.pl')).to.be.true;
    });

    it('returns false when email is not correct', () => {
        expect(Validator.validateEmail('e@mail.')).to.be.false;
        expect(Validator.validateEmail('@mmmmail.pl')).to.be.false;
        expect(Validator.validateEmail('iamamail.com')).to.be.false;
    });
});