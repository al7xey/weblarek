import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";

interface IBasketItem {
  list: HTMLElement[] | string;
}

export class BasketItem extends Component<IBasketItem> {
  protected basketList: HTMLElement;
  public basketButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__item', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
  }

  set list(items: HTMLElement[] | string) {
    if (typeof items === 'string') {
        this.basketList.textContent = items;
    } else {
      items.forEach(item => {
        this.basketList.appendChild(item);
      });
    }
  }
}