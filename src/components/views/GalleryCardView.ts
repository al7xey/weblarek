import { ensureElement } from "../../utils/utils";
import { CardView } from "./CardView";
import { categoryMap, cardCategoryMap } from "../../utils/constants";

interface IGalleryCardView {
  category: string;
  image: string;
}

export class GalleryCardView extends CardView implements IGalleryCardView {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement, onClick?: (event: MouseEvent) => void) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (onClick) {
      this.container.addEventListener('click', onClick);
    }
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
}