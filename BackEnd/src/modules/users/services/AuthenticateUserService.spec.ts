import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashRepository);
    const authenticateUser= new AuthenticateUserService(fakeUsersRepository, fakeHashRepository);

    const user = await createUser.execute({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    })

    const response = await authenticateUser.execute({
      email: 'mailson@davi.com',
      password: '123456'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashRepository = new FakeHashRepository();

    const authenticate= new AuthenticateUserService(fakeUsersRepository, fakeHashRepository);

    await expect(
      authenticate.execute({
        email: 'mailson@davi.com',
        password: '123456'})
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashRepository);
    const authenticate= new AuthenticateUserService(fakeUsersRepository, fakeHashRepository);

    await createUser.execute({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await expect(
      authenticate.execute({
        email: 'mailson@davi.com',
        password: 'wrong-password'
      })).rejects.toBeInstanceOf(AppError);
  });
});
