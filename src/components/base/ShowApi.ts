import { IApi, IProduct, IOrder, IOrderResult } from "../../types";

export class ShowApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  };

  getProducts(): Promise<IProduct[]> {
    return this.api.get('/product/');
  }

  createorder(order: IOrder): Promise<IOrderResult> {
    return this.api.post('/order/', order);
  }
}