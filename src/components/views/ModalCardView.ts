import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CardView } from "./CardView";

interface IModalCardView {
  category: string;
  image: string;
  text: string;
}

export class ModalCardView extends CardView implements IModalCardView {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardText: HTMLElement;
  public cardButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit('basket:add');
    });
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
  }

  set image(value: string) {
    this.cardImage.src = value;
  }

  set text(value: string) {
    this.cardText.textContent = value;
  }
}