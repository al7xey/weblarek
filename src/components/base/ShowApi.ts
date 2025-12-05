import {
  IApi,
  IProductList,
  IOrder,
  IOrderResult
} from "../../types/index.ts";

export class ShowApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProductsList(): Promise<IProductList> {
    return this.api.get<IProductList>("/product/");
  }

  async submitOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order/", order);
  }
}