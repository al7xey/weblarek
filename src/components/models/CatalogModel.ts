import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
  private events: IEvents;
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  
  constructor(events: IEvents) {
    this.events = events;
  }

  setProducts(items: IProduct[]): void {
    this.products = items;
    this.events.emit('catalog:update', {items: this.products});
  }

  getProducts(): IProduct[] {
    return this.products;
  }
  
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }
  
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('product:select', {product: this.selectedProduct});
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  addToCart(): void {
    if (this.selectedProduct) {
      this.events.emit('basket:add-product', { product: this.selectedProduct });
    }
  }
}