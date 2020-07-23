import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async() => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const CreateAppointment = new CreateAppointmentService(fakeAppointmentRepository);

    const appointment = await CreateAppointment.execute({
      date: new Date(),
      providerId: '123465789',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('123465789');
  });

  it('should not be able to create two appointments on the same time', async() => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const CreateAppointment = new CreateAppointmentService(fakeAppointmentRepository);

    const appointmentDate = new Date(2020, 7, 22, 24);

    await CreateAppointment.execute({
      date: appointmentDate,
      providerId: '123465789',
    });

    expect(CreateAppointment.execute({
      date: appointmentDate,
      providerId: '123465789',
    })).rejects.toBeInstanceOf(AppError);
  });
});
