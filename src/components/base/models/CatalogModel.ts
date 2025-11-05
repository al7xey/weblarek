import { IProduct } from "../../../types";

export class CatalogModel {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(items: IProduct[]): void {
    this.products = items;
  }

  getProducts(): IProduct[] {
    return this.products;
  }
  
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }
  
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}