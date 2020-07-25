import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageRepository from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to create a new user', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageRepository = new FakeStorageRepository();

    const UpdateUserAvatar= new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageRepository
    );

    const user = await fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await UpdateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from nom existing user', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageRepository = new FakeStorageRepository();

    const UpdateUserAvatar= new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageRepository
    );

    expect(UpdateUserAvatar.execute({
      userId: 'non-existing-user',
      avatarFilename: 'avatar.jpg',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageRepository = new FakeStorageRepository();

    const deleteFile = jest.spyOn(fakeStorageRepository, 'deleteFile');

    const UpdateUserAvatar= new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageRepository
    );

    const user = await fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await UpdateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await UpdateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });

});
