import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketItem {
  basketList: HTMLElement;
  basketButton: HTMLButtonElement;
  basketTotal: HTMLElement;
  list: HTMLElement[] | string;
  total: number;
}

export class BasketItem extends Component<IBasketItem> {
  protected basketList: HTMLElement;
  public basketButton: HTMLButtonElement;
  protected basketTotal: HTMLElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketTotal = ensureElement<HTMLElement>('.basket__price', this.container);
    
    this.basketButton.type = 'button';
    this.list = [];
    this.basketButton.disabled = true;

    this.basketButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      events.emit('order:address');
    });
  }

  set list(items: HTMLElement[] | string) {
    this.basketList.innerHTML = '';
    if (typeof items === 'string') {
        this.basketList.textContent = items;
    } else if (items.length === 0) {
        // Оставляем пустым для CSS псевдоэлемента или устанавливаем текст один раз
        this.basketList.textContent = 'Корзина пуста';
    } else {
      items.forEach(item => {
        this.basketList.appendChild(item);
      });
    }
  }

  set total(value: number) {
    this.basketTotal.textContent = `${value} синапсов`; 
  }
}