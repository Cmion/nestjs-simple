import { sampleSize } from 'lodash';

export class Helper {
  static generatePassword(length = 12): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';

    return sampleSize(charset, length).join('');
  }
}
