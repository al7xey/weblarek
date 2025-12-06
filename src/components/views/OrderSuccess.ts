import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
  description: string;
  total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected orderDescription: HTMLElement;
  protected orderButton: HTMLButtonElement;
  protected orderTotal: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.orderDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.orderTotal = ensureElement<HTMLElement>('.order-success__description', this.container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
  }

  set description(value: string) {
    this.orderDescription.textContent = value;
  }

  set total(value: number) {
    this.orderTotal.textContent = `Списано ${value} синапсов`; 
  }
}