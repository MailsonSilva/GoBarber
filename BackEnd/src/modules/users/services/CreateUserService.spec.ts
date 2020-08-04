import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashRepository: FakeHashRepository;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashRepository = new FakeHashRepository();
    createUser= new CreateUserService(fakeUsersRepository, fakeHashRepository);
  })

  it('should be able to create a new user', async() => {
    const user = await createUser.execute({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to create a new user with same email from another', async() => {
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
