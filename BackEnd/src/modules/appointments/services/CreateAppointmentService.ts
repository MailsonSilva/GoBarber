import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable,inject } from  'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointments';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
  providerId: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository:IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository:INotificationsRepository,
    ) {}

  public async execute({ providerId, date, user_id}: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if(isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past data.");
    }

    if (user_id === providerId) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("You can only create appointment between 8am and 5pm");
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      providerId,
      user_id,
      date: appointmentDate,
    });

    const dateFormat = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: providerId,
      content: `Novo agendamento para o dia ${dateFormat}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
