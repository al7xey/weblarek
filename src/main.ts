import "./scss/styles.scss";
// Импорт базовых компонентов
import { Api } from './components/base/Api.ts';
import { ShowApi } from './components/base/ShowApi.ts';
import { EventEmitter } from "./components/base/Events.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { IBuyer, IOrder, IProduct } from "./types/index.ts";

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
const larekApi = new ShowApi(api)

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

  // Запрашиваем состояние корзины через событие
  events.emit('cart:check', { productId: product.id, product: product });
});

// Проверка состояния товара в корзине
events.on('cart:check', (data: { productId: string, product: IProduct }) => {
  events.emit('cart:check-request', { productId: data.productId, product: data.product });
});

// Запрос проверки корзины
events.on('cart:check-request', (data: { productId: string, product: IProduct }) => {
  cartModel.checkItem(data.productId, data.product);
});

// Получение результата проверки корзины
events.on('cart:check-response', (data: { productId: string, inCart: boolean, product?: IProduct }) => {
  if (data.product) {
    const product = data.product;
    const isAvailable = product.price !== null;
    const buttonText = !isAvailable ? 'Недоступно' : (data.inCart ? 'Уже в корзине' : 'Купить');
    
    modalCardView.setButtonState(!isAvailable || data.inCart, buttonText);
    modal.content = modalCardView;
    modal.open();
  }
});

// Нажатие кнопки покупки товара
events.on('basket:add', () => {
    catalogModel.addToCart();
});

// Добавление товара в корзину
events.on('basket:add-product', (data: { product: IProduct }) => {
    cartModel.addItem(data.product);
    modal.close();
});

// Удаление товара из корзины
events.on('basket:remove', (data: { productId: string }) => {
    cartModel.removeItem(data.productId);
});

// Очистка корзины
events.on('cart:clear', () => {
    cartModel.clear();
});

// Получение данных покупателя
events.on('buyer:get-data', () => {
    buyerModel.getDataForResponse();
});

// Получение данных корзины
events.on('cart:get-data', () => {
    cartModel.getDataForOrder();
});

// Валидация формы заказа
events.on('buyer:validate-order', () => {
    buyerModel.validateForOrder();
});

// Изменение содержимого корзины 
events.on('cart:change', (data: { count: number }) => {
    header.counter = data.count;
});

const basketElement = cloneTemplate(basketTemplate);
const basketView = new BasketItem(events, basketElement);


// Открытие корзины
events.on('basket:open', () => {
    events.emit('basket:get-data', { open: true });
});

// Запрос данных корзины
let shouldOpenBasket = false;
events.on('basket:get-data', (data?: { open?: boolean }) => {
    shouldOpenBasket = data?.open ?? false;
    cartModel.getBasketData();
});

// Обновление корзины после получения данных
events.on('basket:change', (data: { items: IProduct[], total: number }) => {
    const itemElements: HTMLElement[] = [];

    if (data.items.length > 0) {
        data.items.forEach((product, index) => {
            const basketCardElement = cloneTemplate(cardBasketTemplate);
            
            const basketCardView = new BasketCardView(basketCardElement, () => {
                events.emit('basket:remove', { productId: product.id });
            });
            
            basketCardView.title = product.title;
            basketCardView.price = product.price ?? 0;
            basketCardView.index = index + 1; 

            itemElements.push(basketCardView.render());
        });
        
        basketView.list = itemElements;
        basketView.basketButton.disabled = false;
    } else {
        basketView.list = [];
        basketView.basketButton.disabled = true;
    }

    basketView.total = data.total;
    
    // Открываем модалку только если это был запрос на открытие
    if (shouldOpenBasket) {
        modal.content = basketView;
        modal.open();
        shouldOpenBasket = false;
    }
});

// Закрытие модального окна по событию (например, из кнопок)
events.on('modal:close', () => modal.close());

const orderElement = cloneTemplate(orderTemplate);
const orderForm = new OrderForm(orderElement, events);

// Переход к форме адреса и оплаты 
events.on('order:address', () => { 
    modal.content = orderForm; 
    modal.open(); 
    events.emit('buyer:clear');
});

// Очистка данных покупателя
events.on('buyer:clear', () => {
  buyerModel.clear();
});

// Изменение данных в формах 
events.on('order:change', (data: { field: keyof IBuyer, value: string }) => {
  buyerModel.setData({ [data.field]: data.value } as Partial<IBuyer>);
});

// Принимает обновленные ошибки
events.on('form:change', (data: { errors: Record<string, string>, fields?: Partial<IBuyer> }) => {
  const errors = data.errors;
  const fields = data.fields || buyerModel.getData();
  const activeForm = modal.content; 
  
  if (activeForm instanceof OrderForm) {
    activeForm.error = errors.payment || errors.address || '';
    activeForm.submitButton = !errors.payment && !errors.address;
    activeForm.payment = fields.payment || '';
    activeForm.address = fields.address || '';
  } 
  else if (activeForm instanceof ContactForm) {
    activeForm.error = errors.email || errors.phone || '';
    activeForm.submitButton = !errors.email && !errors.phone;
    if (fields.email !== undefined) activeForm.email = fields.email;
    if (fields.phone !== undefined) activeForm.phone = fields.phone;
  }
});

const contactElement = cloneTemplate(contactTemplate);
const contactForm = new ContactForm(contactElement, events);
    
// Переход к контактам 
events.on('order:submit', () => {
    events.emit('buyer:validate-order');
});

// Результат валидации формы заказа
events.on('buyer:order-validated', (data: { errors: Record<string, string>, fields: IBuyer }) => {
    contactForm.render({ 
        email: data.fields.email ?? '', 
        phone: data.fields.phone ?? '' 
    });
    
    contactForm.submitButton = !data.errors.email && !data.errors.phone; 

    modal.content = contactForm;
    modal.open();
});

const successElement = cloneTemplate(successTemplate);
const successView = new OrderSuccess(events, successElement);

// Отправка заказа
events.on('contacts:submit', () => {
    events.emit('order:create');
});

// Создание заказа
events.on('order:create', () => {
    events.emit('order:get-data');
});

// Получение данных для заказа
events.on('order:get-data', () => {
    events.emit('buyer:get-data');
    events.emit('cart:get-data');
});

// Сбор данных заказа
let orderBuyerData: IBuyer | null = null;
let orderCartData: { total: number, items: string[] } | null = null;

events.on('buyer:data-response', (data: IBuyer) => {
    orderBuyerData = data;
    if (orderCartData) {
        createOrder();
    }
});

events.on('cart:data-response', (data: { total: number, items: string[] }) => {
    orderCartData = data;
    if (orderBuyerData) {
        createOrder();
    }
});

function createOrder() {
    if (!orderBuyerData || !orderCartData) return;
    
    const orderData: IOrder = {
        payment: orderBuyerData.payment!,
        email: orderBuyerData.email!,
        phone: orderBuyerData.phone!,
        address: orderBuyerData.address!,
        total: orderCartData.total,
        items: orderCartData.items,
    };

    larekApi
    .submitOrder(orderData)
    .then(() => {
        events.emit('order:success', { total: orderData.total });
        events.emit('cart:clear');
        events.emit('buyer:clear');
        orderBuyerData = null;
        orderCartData = null;
    })
    .catch((error) => {
        console.error("Ошибка оформления заказа:", error);
    });
}

// Успешное оформление заказа
events.on('order:success', (data: { total: number }) => {
    successView.total = data.total;
    modal.content = successView;
    modal.open();
});


larekApi
  .fetchProductsList()
  .then(({ items }) => {
    catalogModel.setProducts(items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error);
  });