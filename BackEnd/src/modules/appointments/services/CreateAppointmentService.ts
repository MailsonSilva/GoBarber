import { startOfHour } from 'date-fns';
import { injectable,inject } from  'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointments';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  providerId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository:IAppointmentsRepository,
    ) {}

  public async execute({ providerId, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Thie appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      providerId,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
