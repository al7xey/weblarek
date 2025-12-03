import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IContactForm {
  email: string;
  phone: string;
}

export class ContactForm extends Form<IContactForm> {
  protected inputEmail: HTMLInputElement;
  protected inputPhone: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.inputPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.container.addEventListener('submit', (evt) => { 
      evt.preventDefault(); 
      events.emit('contacts:submit');  
    }); 

    this.inputEmail.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      events.emit('order:change', { field: 'email', value: target.value });
    });

    this.inputPhone.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      events.emit('order:change', { field: 'phone', value: target.value });
    });
  }
  
  set email(value: string) {
    this.inputEmail.textContent = value;
  }

  set phone(value: string) {
    this.inputPhone.textContent = value;
  }
}