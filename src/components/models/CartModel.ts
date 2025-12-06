import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

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
      this.notifyChange();
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.notifyChange();
  }

  clear(): void {
    this.items = [];
    this.notifyChange();
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

  checkItem(id: string, product?: IProduct): void {
    const inCart = this.hasItem(id);
    this.events.emit('cart:check-response', { productId: id, inCart, product });
  }

  getDataForOrder(): void {
    this.events.emit('cart:data-response', {
      total: this.getTotalPrice(),
      items: this.items.map(p => p.id)
    });
  }

  getBasketData(): void {
    this.events.emit('basket:change', { 
      items: this.items, 
      total: this.getTotalPrice() 
    });
  }

  private notifyChange() {
    this.events.emit('cart:change', { count: this.items.length });
    this.events.emit('basket:change', { 
      items: this.items, 
      total: this.getTotalPrice() 
    });
  }
}
