import {uuid} from 'uuidv4';
import {isEqual, getMonth, getYear, getDate} from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllInMonthProvidersDTO from '@modules/appointments/dtos/IFindAllInMonthFromProvidersDTO';
import IFindAllInDayProvidersDTO from '@modules/appointments/dtos/IFindAllInDayFromProvidersDTO';

import Appointment from '../../infra/typeorm/entities/Appointments';

class FakeAppointmentsRepository implements IAppointmentsRepository{
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date),
    );
    return findAppointment;
  };

  public async findAllInMonthFromProvider({
    providerId,
    month,
    year}
    : IFindAllInMonthProvidersDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment =>
        appointment.providerId === providerId &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    );
    return appointments;
  };

  public async findAllInDayFromProvider({
    providerId,
    month,
    year,
    day,
    }
    : IFindAllInDayProvidersDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment =>
        appointment.providerId === providerId &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    );
    return appointments;
  };

  public async create({providerId, user_id, date}:ICreateAppointmentDTO):Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, providerId, user_id});

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentsRepository;
