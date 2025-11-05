import './scss/styles.scss';
import { apiProducts } from "./utils/data.ts";
import { CatalogModel } from './components/base/models/CatalogModel.ts';
import { CartModel } from './components/base/models/CartModel.ts';
import { BuyerModel } from './components/base/models/BuyerModel.ts';

const catalogModel = new CatalogModel();
catalogModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", catalogModel.getProducts())

const cartModel = new CartModel();
cartModel.getItems();
console.log("Массив товаров из карзины: ", cartModel.getItems())

const buyerModel = new BuyerModel();
buyerModel.clear();
console.log("Массив покупателей: ", buyerModel.getData())