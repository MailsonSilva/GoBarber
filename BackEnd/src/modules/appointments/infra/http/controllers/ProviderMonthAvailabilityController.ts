import { Request, Response} from 'express';
import {container} from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response>{
    const providerId =request.params.id;
    const { month, year} = request.query;

    const listProviderMonthAvailabilityService = container.resolve(ListProviderMonthAvailabilityService);

    const availability = await listProviderMonthAvailabilityService.execute({
      providerId,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
