import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";


interface IModalWindow {
  content: HTMLElement;
}

export class ModalWindow extends Component<IModalWindow> {
  protected modalCloseButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);
  }

  set content(item: HTMLElement) {
    this.modalContent.appendChild(item);
  }

  open() {
    this.container.classList.add('modal_active');
  }
  
  close() {
    this.container.classList.remove('modal_active');
  }

}