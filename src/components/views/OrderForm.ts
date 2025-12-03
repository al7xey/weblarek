import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

interface IOrderForm {
  address: string;
  payment: TPayment;
}

export class OrderForm extends Form<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected inputAddress: HTMLInputElement;
  public orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); 

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'cash' });
    });

    this.inputAddress.addEventListener('input', (evt: Event) => {
        const target = evt.target as HTMLInputElement;
        events.emit('order:change', { field: 'address', value: target.value });
    });

    this.container.addEventListener('submit', (evt: Event) => {
        evt.preventDefault();
        this.events.emit('order:submit'); 
    });
  }

  set address(value: string) {
    this.inputAddress.value = value; 
  }

  set payment(value: TPayment) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }
}