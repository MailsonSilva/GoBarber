export default interface IStorageProvider {
  sendMail(to: string, body: string): Promise<void>;
}
