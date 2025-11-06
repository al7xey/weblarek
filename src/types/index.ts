export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';


export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
} 

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
} 

export interface IOrder {
  items: string[];
  total: number;
  buyer: IBuyer;
}

// Объект заказа, который приложение отправляет на сервер.
export interface IOrder {
	items: string[]; // массив id товаров из IProduct
	total: number;   // общая сумма заказа
	buyer: IBuyer;   // данные покупателя
}

// Объект, который сервер возвращает после успешного оформления заказа.
export interface IOrderResult {
	id: string;     // уникальный идентификатор заказа, присвоенный сервером
	total: number;  // подтверждённая сумма заказа
}

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