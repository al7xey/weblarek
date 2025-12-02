import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../Events";
import { CardView } from "./CardView";

interface IBasketCardView {
  index: number;
}

export class BasketCardView extends CardView implements IBasketCardView {
  protected basketCardIndex: HTMLElement;
  public basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.basketCardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
  }

  set index(value: number) {
    this.basketCardIndex.textContent = value.toString();
  }
}