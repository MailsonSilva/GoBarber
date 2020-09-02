import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
};

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    providerId,
    day,
    year,
    month
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${providerId}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        providerId,
        day,
        year,
        month
      });

      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }
    return appointments;
  }
}

export default ListProviderAppointmentsService;
