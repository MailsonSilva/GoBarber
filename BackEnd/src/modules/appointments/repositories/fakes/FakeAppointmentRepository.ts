import {uuid} from 'uuidv4';
import {isEqual} from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO'

import Appointment from '../../infra/typeorm/entities/Appointments';

class AppointmentsRepository implements IAppointmentsRepository{
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date),
    );
    return findAppointment;
  }

  public async create({providerId, date}:ICreateAppointmentDTO):Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, providerId});

    // appointment.id = uuid();
    // appointment.date = date;
    // appointment.providerId = providerId;

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
