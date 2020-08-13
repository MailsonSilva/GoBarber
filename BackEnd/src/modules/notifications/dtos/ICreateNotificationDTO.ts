import { instanceCachingFactory } from "tsyringe";

export default interface ICreateNotificationDTO {
  content: string;
  recipient_id: string;
}
