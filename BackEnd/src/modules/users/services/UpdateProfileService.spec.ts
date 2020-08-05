import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Davi',
      email: 'mailson@gmail.com',
    });

    expect(updateUser.name).toBe('Davi');
    expect(updateUser.email).toBe('mailson@gmail.com');
  });

  it('should not be able update the profile from non-existing user', async () => {
    await expect(updateProfile.execute({
      user_id: 'non-existing-user-id',
      name: 'Test',
      email: 'teste@example.com'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email ', async () => {
    await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@davi.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Davi',
      email: 'mailson@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updateUser.password).toBe('123123');
  });

  it('should be able update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Davi',
      email: 'mailson@gmail.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Davi',
      email: 'mailson@gmail.com',
      old_password: 'wrong-old-password',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });
});
