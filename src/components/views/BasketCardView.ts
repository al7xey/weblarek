import { ensureElement } from "../../utils/utils";
import { CardView } from "./CardView";

interface IBasketCardView {
  index: number;
}

export class BasketCardView extends CardView implements IBasketCardView {
  protected basketCardIndex: HTMLElement;
  public basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.basketCardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.basketButton.addEventListener('click', onClick);
  }

  set index(value: number) {
    this.basketCardIndex.textContent = value.toString();
  }
}