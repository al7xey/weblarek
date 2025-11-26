import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";
import { IEvents } from "../Events";

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);

  }

  set catalog(items: HTMLElement[]) {
    items.forEach(item => {
      this.catalogElement.appendChild(item);
    })
  }
}