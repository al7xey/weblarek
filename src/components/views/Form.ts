import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IForm {
  error: string;
  submitButton: boolean;
}

export class Form<T> extends Component<IForm & T> {
  formError: HTMLElement;
  formButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.formError = ensureElement<HTMLElement>('.form__errors', this.container);
    this.formButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
  }

  set error(value: string) {
    this.formError.textContent = value;
  }

  set submitButton(enabled: boolean) {
    this.formButton.disabled = !enabled;
  }
}

