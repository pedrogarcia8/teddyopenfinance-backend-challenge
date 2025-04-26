/* eslint-disable @typescript-eslint/unbound-method */
import { User } from '../entities/user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository (mocked)', () => {
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
  });

  it('Should create a user', async () => {
    const user = new User('test@example.com', 'password123');

    userRepository.create.mockResolvedValue(user);

    const createdUser = await userRepository.create(user);

    expect(createdUser).toEqual(user);
    expect(userRepository.create).toHaveBeenCalledWith(user);
  });

  it('Should find a user by email', async () => {
    const user = new User('test@example.com', 'password123');

    userRepository.findByEmail.mockResolvedValue(user);

    const foundUser = await userRepository.findByEmail('test@example.com');

    expect(foundUser).toEqual(user);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('Should return null if user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const foundUser = await userRepository.findByEmail('test@example.com');

    expect(foundUser).toBeNull();
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});
