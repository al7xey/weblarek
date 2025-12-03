import { IEvents } from "../base/Events";
import { IBuyer, TPayment } from "../../types";

export class BuyerModel {
  private events: IEvents;
  private payment: TPayment = '' as TPayment;
  private email: string = '';
  private phone: string = '';
  private address: string = ''; 

  constructor(events: IEvents) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;

    if (data.email !== undefined) this.email = data.email;
    
    if (data.phone !== undefined) this.phone = data.phone;

    if (data.address !== undefined) this.address = data.address;

    const errors = this.validate();
    this.events.emit('form:change', { errors: errors, fields: data });

  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }

  clear(): void {
    this.payment = '' as TPayment;
    this.email = '';
    this.phone = '';
    this.address = '';
    const errors = this.validate();
    this.events.emit('form:change', { errors: errors });
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.payment) errors.payment = 'Не выбран способ оплаты';
    if (!this.email) errors.email = 'Укажите e-mail';
    if (!this.phone) errors.phone = 'Укажите номер телефона';
    if (!this.address) errors.address = 'Укажите адрес доставки';
    return errors;
  }
}
