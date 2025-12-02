import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";

interface IContactForm {
  email: string;
  phone: string;
}

export class ContactForm extends Form<IContactForm> {
  protected inputEmail: HTMLInputElement;
  protected inputPhone: HTMLInputElement;

  constructor(container: HTMLElement) {
    super(container);

    this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.inputPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
  }
  
  set email(value: string) {
    this.inputEmail.textContent = value;
  }

  set phone(value: string) {
    this.inputPhone.textContent = value;
  }
}