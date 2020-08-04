import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashRepository: FakeHashRepository;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashRepository = new FakeHashRepository();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashRepository);
    authenticateUser= new AuthenticateUserService(fakeUsersRepository, fakeHashRepository);
  })

  it('should be able to authenticate', async() => {
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
    await expect(
      authenticateUser.execute({
        email: 'mailson@davi.com',
        password: '123456'})
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async() => {
    await createUser.execute({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await expect(
      authenticateUser.execute({
        email: 'mailson@davi.com',
        password: 'wrong-password'
      })).rejects.toBeInstanceOf(AppError);
  });
});
