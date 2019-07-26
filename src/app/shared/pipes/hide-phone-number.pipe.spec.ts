import { HidePhoneNumberPipe } from './hide-phone-number.pipe';

describe('HidePhoneNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new HidePhoneNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
