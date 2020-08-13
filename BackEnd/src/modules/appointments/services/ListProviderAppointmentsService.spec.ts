import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointments1 = await fakeAppointmentsRepository.create({
      providerId: 'provider',
      user_id: 'user',
      date: new Date(2020, 8, 12, 8, 0, 0),
    });

    const appointments2 = await fakeAppointmentsRepository.create({
      providerId: 'provider',
      user_id: 'user',
      date: new Date(2020, 8, 12, 10, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      providerId: 'provider',
      year: 2020,
      month: 9,
      day: 12
    });

    expect(appointments).toEqual([
      appointments1,
      appointments2
    ]);

  });
});
