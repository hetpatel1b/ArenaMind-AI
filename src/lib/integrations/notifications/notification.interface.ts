export interface EmailPayload {
  to: string;
  subject: string;
  bodyHtml: string;
}

export interface SmsPayload {
  phoneNumber: string;
  message: string;
}

export interface INotificationProvider {
  sendEmail(payload: EmailPayload): Promise<void>;
  sendSms(payload: SmsPayload): Promise<void>;
}
