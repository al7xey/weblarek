import { ensureElement } from "../../utils/utils";
import { CardView } from "./CardView";

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
  }

  set image(value: string) {
    this.cardImage.src = value;
  }
}