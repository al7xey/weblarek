import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";

interface ICardView {
  title: string;
  price: number;
}

export class CardView extends Component<ICardView> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
  }
  
  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number) {
    this.cardPrice.textContent = `${value} синапсов`;
  }
}