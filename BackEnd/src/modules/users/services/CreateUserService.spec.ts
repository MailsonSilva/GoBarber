import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUser= new CreateUserService(fakeUsersRepository, fakeHashRepository);

    const user = await createUser.execute({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to create a new user with same email from another', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUser= new CreateUserService(fakeUsersRepository, fakeHashRepository);

    await createUser.execute({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await expect(createUser.execute({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });
});
