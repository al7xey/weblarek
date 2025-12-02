import { IProduct } from "../../../types";
import { IEvents } from "../Events"

export class CartModel {
  private events: IEvents;
  private items: IProduct[] = [];

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
      this.events.emit('cart:change');
    }
  }

  removeItem(id: string): void {
    this.items.filter(item => item.id !== id);
    this.events.emit('cart:change');
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:change');
  }

  getTotalPrice(): number {
    return this.items.reduce((total, product) => total + (product.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(product => product.id === id);
  }
}
