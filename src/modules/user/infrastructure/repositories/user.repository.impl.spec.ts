/* eslint-disable @typescript-eslint/unbound-method */
import { UserRepositoryImpl } from './user.repository.impl';
import { UserOrmEntity } from '../entities/user.entity';
import { User } from '../../domain/entities/user.entity';
import { Repository } from 'typeorm';

describe('User Repository Impl', () => {
  let userRepositoryImpl: UserRepositoryImpl;
  let userOrmRepository: Repository<UserOrmEntity>;

  beforeEach(() => {
    userOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    } as unknown as Repository<UserOrmEntity>;

    userRepositoryImpl = new UserRepositoryImpl(userOrmRepository);
  });

  describe('Create', () => {
    it('Should create and save a user', async () => {
      const userData = new User('test@example.com', 'password123');

      const ormUser = new UserOrmEntity();
      ormUser.email = userData.email;
      ormUser.password = userData.password;

      (userOrmRepository.create as jest.Mock).mockReturnValue(ormUser);
      (userOrmRepository.save as jest.Mock).mockResolvedValue(ormUser);

      const result = await userRepositoryImpl.create(userData);

      expect(userOrmRepository.create).toHaveBeenCalledWith(userData);
      expect(userOrmRepository.save).toHaveBeenCalledWith(ormUser);
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe(userData.email);
      expect(result.password).toBe(userData.password);
    });
  });

  describe('FindByEmail', () => {
    it('Should return a user if found by email', async () => {
      const userData = new User('test@example.com', 'password123');
      const ormUser = new UserOrmEntity();
      ormUser.email = userData.email;
      ormUser.password = userData.password;
      ormUser.id = 'd8c3c7c2-d874-47fb-8a6f-6945d9447e9d';

      (userOrmRepository.findOne as jest.Mock).mockResolvedValue(ormUser);

      const result = await userRepositoryImpl.findByEmail(userData.email);

      expect(userOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe(userData.email);
      expect(result?.password).toBe(userData.password);
    });

    it('Should return null if no user is found by email', async () => {
      const email = 'test@example.com';

      (userOrmRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepositoryImpl.findByEmail(email);

      expect(userOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });
});
