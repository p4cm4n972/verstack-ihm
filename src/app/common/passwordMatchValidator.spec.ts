import { FormControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator } from './passwordMatchValidator';

describe('passwordMatchValidator', () => {
  it('returns null when passwords match', () => {
    const group = new FormGroup({
      password: new FormControl('abc'),
      confirmPassword: new FormControl('abc')
    });
    expect(passwordMatchValidator(group)).toBeNull();
  });

  it('returns error when passwords mismatch', () => {
    const group = new FormGroup({
      password: new FormControl('abc'),
      confirmPassword: new FormControl('def')
    });
    expect(passwordMatchValidator(group)).toEqual({ passwordMismatch: true });
  });
});
