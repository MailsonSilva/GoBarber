import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {

  beforeEach(()=>{
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  })


  it('should be able to create a new appointment', async() => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      providerId: '123465789',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('123465789');
  });

  it('should not be able to create two appointments on the same time', async() => {
    const appointmentDate = new Date(2020, 7, 22, 24);

    await createAppointment.execute({
      date: appointmentDate,
      providerId: '123465789',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      providerId: '123465789',
    })).rejects.toBeInstanceOf(AppError);
  });
});
