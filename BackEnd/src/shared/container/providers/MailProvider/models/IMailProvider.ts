import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IStorageProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
