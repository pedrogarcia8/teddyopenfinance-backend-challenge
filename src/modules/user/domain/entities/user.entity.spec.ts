import { User } from './user.entity';

describe('User Entity', () => {
  it('Should create a user with email and password', () => {
    const email = 'test@example.com';
    const password = '123';

    const user = new User(email, password);

    expect(user).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
    expect(user.id).toBeUndefined();
    expect(user.createdAt).toBeUndefined();
    expect(user.updatedAt).toBeUndefined();
  });

  it('Should create a user with all properties', () => {
    const email = 'test@example.com';
    const password = '123';
    const id = 'd8c3c7c2-d874-47fb-8a6f-6945d9447e9d';
    const createdAt = new Date();
    const updatedAt = new Date();

    const user = new User(email, password, id, createdAt, updatedAt);

    expect(user.id).toBe(id);
    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
  });
});
