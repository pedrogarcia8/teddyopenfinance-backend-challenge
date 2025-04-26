import isValidUUID from './is-valid-uuid';

describe('isValidUUID', () => {
  it('Should return true for a valid UUID v1', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    expect(isValidUUID(validUUID)).toBe(true);
  });

  it('Should return true for a valid UUID v4', () => {
    const validUUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    expect(isValidUUID(validUUID)).toBe(true);
  });

  it('Should return false for an invalid UUID (wrong format)', () => {
    const invalidUUID = '550e8400-e29b-41d4-a716-44665544000';
    expect(isValidUUID(invalidUUID)).toBe(false);
  });

  it('Should return false for a UUID with invalid characters', () => {
    const invalidUUID = '550e8400-e29b-41d4-a716-44665544zzzz';
    expect(isValidUUID(invalidUUID)).toBe(false);
  });

  it('Should return false for an empty string', () => {
    const emptyString = '';
    expect(isValidUUID(emptyString)).toBe(false);
  });

  it('Should return false for a UUID with wrong length', () => {
    const wrongLengthUUID = '550e8400-e29b-41d4-a716';
    expect(isValidUUID(wrongLengthUUID)).toBe(false);
  });
});
