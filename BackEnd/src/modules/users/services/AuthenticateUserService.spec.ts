import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashRepository: FakeHashRepository;
let authenticateUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashRepository = new FakeHashRepository();
    fakeCacheProvider = new FakeCacheProvider();

    authenticateUser= new AuthenticateUserService(fakeUsersRepository, fakeHashRepository);
  })

  it('should be able to authenticate', async() => {
    const user = await fakeUsersRepository.create({
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
    await expect(
      authenticateUser.execute({
        email: 'mailson@davi.com',
        password: '123456'})
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async() => {
    fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    })

    await expect(
      authenticateUser.execute({
        email: 'mailson@davi.com',
        password: 'wrong-password'
      })).rejects.toBeInstanceOf(AppError);
  });
});
