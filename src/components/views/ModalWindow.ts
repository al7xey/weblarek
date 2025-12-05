import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


interface IModalWindow {
  content: HTMLElement;
}

export class ModalWindow extends Component<IModalWindow> { 
  protected modalCloseButton: HTMLButtonElement; 
  protected modalContent: HTMLElement; 
  private currentContent: HTMLElement | null = null;
  private currentInstance: Component<any> | null = null;

  constructor(container: HTMLElement) { 
    super(container); 

    this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container); 
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container); 

    this.modalCloseButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.handleOverlayClick.bind(this));
  } 

  set content(item: HTMLElement | Component<unknown>) { 
    this.modalContent.innerHTML = '';

    if (typeof (item as any)?.render === 'function') {
      this.currentInstance = item as Component<unknown>;
      this.currentContent = this.currentInstance.element;
      this.modalContent.appendChild(this.currentInstance.render());
    } else {
      this.currentInstance = null;
    }
  } 

  get content(): HTMLElement | Component<unknown> | null {
    return this.currentInstance ?? this.currentContent;
  }

  open() { 
    this.container.classList.add('modal_active'); 
  } 
   
  close() { 
    this.container.classList.remove('modal_active'); 
    this.modalContent.innerHTML = '';
    this.currentInstance = null;
    this.currentContent = null;
  } 

  private handleOverlayClick(event: MouseEvent) {
    if (!this.modalContent.contains(event.target as HTMLElement)) {
      this.close();
    }
  }
}