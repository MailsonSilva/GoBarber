import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProvidersDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProvidersDTO';

import Appointment from '../entities/Appointments';

class AppointmentsRepository implements IAppointmentsRepository{
  private ormRepository:Repository<Appointment>

  constructor(){
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date, providerId: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, providerId },
    });
    return findAppointment || undefined;
  };

  public async findAllInMonthFromProvider({
    providerId,
    month,
    year
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        providerId,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parseMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  };

  public async findAllInDayFromProvider({
    providerId,
    month,
    year,
    day
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parseDay = String(day).padStart(2, '0');
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        providerId,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parseMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return appointments;
  };

  public async create({providerId, user_id, date}:ICreateAppointmentDTO):Promise<Appointment> {
    const appointment = this.ormRepository.create({
      providerId,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  };
}

export default AppointmentsRepository;
