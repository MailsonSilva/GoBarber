import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {

  beforeEach(()=>{
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });

  it('should be able to create a new appointment', async() => {
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020, 8, 12, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 8, 12, 13),
      user_id: 'user-id',
      providerId: 'provider-Id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('provider-Id');
  });

  it('should not be able to create two appointments on the same time', async() => {
    const appointmentDate = new Date(2020, 8, 12, 12);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user-id',
      providerId: 'provider-id',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      user_id: 'user-id',
      providerId: 'provider-id',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () =>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020, 8, 12, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 8, 12, 11),
      user_id: 'user-id',
      providerId: 'provider-id',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment with same user as provider', async () =>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020, 8, 12, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 8, 12, 13),
      user_id: 'user-id',
      providerId: 'user-id',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment before 8am and after 5pm', async () =>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020, 8, 11, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 8, 12, 7),
      user_id: 'user-id',
      providerId: 'provider-id',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      date: new Date(2020, 8, 12, 18),
      user_id: 'user-id',
      providerId: 'provider-id',
    })).rejects.toBeInstanceOf(AppError);

  });
});
