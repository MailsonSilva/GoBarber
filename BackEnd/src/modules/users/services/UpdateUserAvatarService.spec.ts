import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageRepository from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageRepository: FakeStorageRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageRepository = new FakeStorageRepository();
    updateUserAvatar= new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageRepository
    );
  });

  it('should be able to create a new user', async() => {
    const user = await fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from nom existing user', async() => {
    await expect(updateUserAvatar.execute({
      userId: 'non-existing-user',
      avatarFilename: 'avatar.jpg',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async() => {
    const deleteFile = jest.spyOn(fakeStorageRepository, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Mailson',
      email: 'mailson@davi.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });

});
