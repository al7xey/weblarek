import "./scss/styles.scss";
import { apiProducts } from "./utils/data.ts";
import { CatalogModel } from './components/base/models/CatalogModel.ts';
import { CartModel } from './components/base/models/CartModel.ts';
import { BuyerModel } from './components/base/models/BuyerModel.ts';
import { Api } from './components/base/Api.ts';
import { ShowApi } from "./components/base/api/ShowApi.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";
import { TPayment } from "./types/index.ts";

// экземпляры моделей
const catalogModel = new CatalogModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// экземпляры API
const api = new Api(API_URL);
const showApi = new ShowApi(api);

// тестируем CatalogModel
console.log("Тестирование CatalogModel");

catalogModel.setProducts(apiProducts.items);
console.log("Массив из каталога товаров: ",  catalogModel.getProducts());

const testProduct = catalogModel.getProducts()[0];
console.log("Первый товар из каталога: ", testProduct);

catalogModel.setSelectedProduct(testProduct);
console.log("Выбранный товар из каталога (выбрали первый): ", catalogModel.getSelectedProduct());

console.log("Товар по ID: ", catalogModel.getProductById(testProduct.id));

// тестируем CartModel
console.log("\nТестирование CartModel");

console.log("Начальное состояние корзины: ", cartModel.getItems());
console.log("Количество товаров в корзине: ", cartModel.getCount());
console.log("Общая стоимость корзины: ", cartModel.getTotalPrice());

cartModel.addItem(testProduct);
console.log("После добавления товара: ", cartModel.getItems());
console.log("Количество товаров после добавления: ", cartModel.getCount());
console.log("Общая стоимость после добавления: ", cartModel.getTotalPrice());
console.log("Проверка наличия товара: ", cartModel.hasItem(testProduct.id));

cartModel.removeItem(testProduct.id);
console.log("После удаления товара: ", cartModel.getItems());
console.log("Количество товаров после удаления: ", cartModel.getCount());

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log("После добавления нескольких товаров: ", cartModel.getItems());
console.log("Общая стоимость нескольких товаров: ", cartModel.getTotalPrice());

cartModel.clear();
console.log("После очистки корзины: ", cartModel.getItems())

// тестируем BuyerModel
console.log('\nТестирование BuyerModel');

console.log("Начальные данные покупателя: ", buyerModel.getData());

const testBuyerData: {
  payment: TPayment,
  email: string,
  phone: string,
  address: string
} = {
    payment: 'card',
    email: 'test@example.com',
    phone: '+79991234567',
    address: 'ул. Тестовая, д. 1'
};

buyerModel.setData(testBuyerData);
console.log("Данные после установки: ", buyerModel.getData());

buyerModel.setData({ email: 'new@example.com' });
console.log("Данные после частичного обновления: ", buyerModel.getData());

console.log("Результат валидации: ", buyerModel.validate());

buyerModel.clear();
console.log("Данные после очистки: ", buyerModel.getData());

// тестируем API
console.log('\nТестирование API');

showApi.getProducts().then(products => {
  console.log("Товары с сервера: ", products);

  catalogModel.setProducts(products);
  console.log("Товары в модели после API: ", catalogModel.getProducts());

  const testOrder = {
    payment: 'cash',
    email: 'test@example.com',
    phone: '+79991234567',
    address: 'ул. Тестовая, д. 1',
    total: cartModel.getTotalPrice(),
    items: cartModel.getItems().map(item => item.id)
  };

  console.log("Тестовый заказ для отправки: ", testOrder);
})
.catch(error => {
  console.error("Ошибка при получении товаров с сервера: ", error);
});

console.log('CDN_URL для изображений: ', CDN_URL);