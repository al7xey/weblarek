import "./scss/styles.scss";
// Импорт базовых компонентов
import { Api } from './components/base/Api.ts';
import { EventEmitter } from "./components/base/Events.ts";
import { ShowApi } from "./components/base/ShowApi.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { IBuyer, IOrder, IOrderResult, IProduct } from "./types/index.ts";

// Импорт моделей
import { CatalogModel } from "./components/models/CatalogModel.ts";
import { CartModel } from "./components/models/CartModel.ts";
import { BuyerModel } from "./components/models/BuyerModel.ts";

// Импорт компонентов Представления
import { Gallery } from "./components/views/Gallery.ts";
import { GalleryCardView } from "./components/views/GalleryCardView.ts";
import { Header } from "./components/views/Header.ts";
import { ModalWindow } from "./components/views/ModalWindow.ts";
import { ModalCardView } from "./components/views/ModalCardView.ts"; 
import { BasketItem } from "./components/views/BasketItem.ts";
import { BasketCardView } from "./components/views/BasketCardView.ts";
import { OrderForm } from "./components/views/OrderForm.ts";
import { ContactForm } from "./components/views/ContactForm.ts";
import { OrderSuccess } from "./components/views/OrderSuccess.ts";

// Инициализация обработчика событий
const events = new EventEmitter();

// Инициализация Api
const api = new Api(API_URL);
const showApi = new ShowApi(api);

// Инициализация Моделей
const catalogModel = new CatalogModel(events); 
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Инициализация Представлений
// Получение шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Получение контейнеров
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const headerContainer = ensureElement<HTMLElement>('.header');
const modalContainer = ensureElement<HTMLElement>('#modal-container'); 

// Инициализируем компоненты View
const gallery = new Gallery(galleryContainer);
const header = new Header(events, headerContainer);
const modal = new ModalWindow(modalContainer);


// Обработка событий каталога товаров
events.on('catalog:update', (data: {items: IProduct[]}) => {
    gallery.catalog = data.items.map(product => {
        const cardElement = cloneTemplate(cardCatalogTemplate);
        const cardView = new GalleryCardView(cardElement, () => {
            events.emit('card:select', { product: product }); 
        });

        cardView.title = product.title; 
        cardView.price = product.price ?? 0;
        cardView.category = product.category;

        if (product.image) {
            cardView.image = CDN_URL + product.image;
        }

        return cardView.render();
    });

    header.counter = cartModel.getCount();
});

// Выбор карточки
events.on('card:select', (data: { product: IProduct }) => {
    catalogModel.setSelectedProduct(data.product);
});

const previewCardElement = cloneTemplate(cardPreviewTemplate);
const modalCardView = new ModalCardView(events, previewCardElement);

// Детальный просмотр
events.on('product:select', (data: {product: IProduct}) => {
  const product = data.product;

  modalCardView.title = product.title;
  modalCardView.price = product.price ?? 0;
  modalCardView.category = product.category;
  modalCardView.text = product.description;

  if (product.image) {
    modalCardView.image = CDN_URL + product.image;
  }

  const inCart = cartModel.hasItem(product.id);
  const isAvailable = product.price !== null;
  
  modalCardView.cardButton.disabled = !isAvailable || inCart;
  modalCardView.cardButton.textContent = !isAvailable ? 'Недоступно' : (inCart ? 'Уже в корзине' : 'Купить');

  modal.content = modalCardView.render();
  modal.open();
});

// Нажатие кнопки покупки товара
events.on('basket:add', () => {
    const product = catalogModel.getSelectedProduct();
    if (product) {
        cartModel.addItem(product);
        modal.close();
    }
});

// Изменение содержимого корзины 
events.on('cart:change', () => {
    header.counter = cartModel.getCount();
});

const basketElement = cloneTemplate(basketTemplate);
const basketView = new BasketItem(events, basketElement);

modal.content = basketView.render();

// Обновление корзины
events.on('basket:change', () => {
    const cartItems = cartModel.getItems();
    const itemElements: HTMLElement[] = [];
    const total = cartModel.getTotalPrice();

    if (cartItems.length > 0) {
        cartItems.forEach((product, index) => {
            const basketCardElement = cloneTemplate(cardBasketTemplate);
            
            const basketCardView = new BasketCardView(basketCardElement, () => {
                cartModel.removeItem(product.id);
            });
            
            basketCardView.title = product.title;
            basketCardView.price = product.price ?? 0;
            basketCardView.index = index + 1; 

            itemElements.push(basketCardView.render());
        });
        
        basketView.list = itemElements;
        basketView.basketButton.disabled = false;
    } else {
        basketView.list = 'Корзина пуста';
        basketView.basketButton.disabled = true;
    }

    basketView.total = total;
});

// Открытие корзины
events.on('basket:open', () => {
    modal.open();
});

const orderElement = cloneTemplate(orderTemplate);
const orderForm = new OrderForm(orderElement, events);

// Переход к форме адреса и оплаты 
events.on('order:address', () => { 
    buyerModel.clear();  
    const currentData = buyerModel.getData(); 
     
    orderForm.render({ payment: currentData.payment, address: currentData.address ?? '' }); 
    orderForm.submitButton = false;  

    modal.content = orderForm.render(); 
    modal.open(); 
});

// Изменение данных в формах 
events.on('order:change', (data: { field: keyof IBuyer, value: string }) => {
  buyerModel.setData({ [data.field]: data.value } as Partial<IBuyer>);
});

// Принимает обновленные ошибки
events.on('form:change', (data: { errors: Record<string, string>, fields: Partial<IBuyer> }) => {
  const errors = data.errors;
  const currentData = buyerModel.getData();
  const activeForm = modal.content; 
  
  if (activeForm instanceof OrderForm) {
    activeForm.error = errors.payment || errors.address || '';
    activeForm.submitButton = !errors.payment && !errors.address;
    activeForm.payment = currentData.payment;
  } 
  else if (activeForm instanceof ContactForm) {
    activeForm.error = errors.email || errors.phone || '';
    activeForm.submitButton = !errors.email && !errors.phone;
  }
});

const contactElement = cloneTemplate(contactTemplate);
const contactForm = new ContactForm(contactElement, events);
    
// Переход к контактам 
events.on('order:submit', () => {
    const currentData = buyerModel.getData();
    const errors = buyerModel.validate(); 

    contactForm.render({ 
        email: currentData.email ?? '', 
        phone: currentData.phone ?? '' 
    });
    
    contactForm.submitButton = !errors.email && !errors.phone; 

    modal.content = contactForm.render();
    modal.open();
});

const successElement = cloneTemplate(successTemplate);
const successView = new OrderSuccess(successElement);
// Отправка заказа
events.on('contacts:submit', () => {
    const customerData = buyerModel.getData();
    
    const orderData: IOrder = {
        payment: customerData.payment!,
        email: customerData.email!,
        phone: customerData.phone!,
        address: customerData.address!,
        total: cartModel.getTotalPrice(),
        items: cartModel.getItems().map(p => p.id),
    };

    api.post<IOrderResult>('/order', orderData)
        .then((result: IOrderResult) => {
            
            successView.total = result.total; 
            
            modal.content = successView.render();
            
            cartModel.clear(); 
            buyerModel.clear(); 
        })
        .catch(err => {
            console.error("Ошибка при отправке заказа:", err);
        });
});

// Загрузка данных
showApi.getProducts()
    .then((products) => {
        catalogModel.setProducts(products);
    })
    .catch(err => {
        console.error("Ошибка при получении товаров с сервера:", err);
    });