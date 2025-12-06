import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CardView } from "./CardView";
import { categoryMap, cardCategoryMap } from "../../utils/constants";

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
    
    // Устанавливаем класс категории для фона карточки
    const categoryClass = cardCategoryMap[value as keyof typeof cardCategoryMap];
    const categoryLabelClass = categoryMap[value as keyof typeof categoryMap];
    
    // Удаляем все классы категорий
    this.container.classList.remove('card_soft', 'card_hard', 'card_button', 'card_additional', 'card_other');
    this.cardCategory.classList.remove('card__category_soft', 'card__category_hard', 'card__category_button', 'card__category_additional', 'card__category_other');
    
    // Добавляем нужные классы
    if (categoryClass) {
      this.container.classList.add(categoryClass);
    }
    if (categoryLabelClass) {
      this.cardCategory.classList.add(categoryLabelClass);
    }
  }

  set image(value: string) {
    this.cardImage.src = value;
  }

  set text(value: string) {
    this.cardText.textContent = value;
  }

  setButtonState(disabled: boolean, text: string) {
    this.cardButton.disabled = disabled;
    this.cardButton.textContent = text;
  }
}