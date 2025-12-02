import "./scss/styles.scss";
// Импорт базовых компонентов
import { Api } from './components/base/Api.ts';
import { EventEmitter } from "./components/base/Events.ts";
import { ShowApi } from "./components/base/api/ShowApi.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { IBuyer, IOrder, IOrderResult, IProduct } from "./types/index.ts";

// Импорт моделей
import { CatalogModel } from './components/base/models/CatalogModel.ts';
import { CartModel } from './components/base/models/CartModel.ts';
import { BuyerModel } from './components/base/models/BuyerModel.ts';

// Импорт компонентов Представления
import { Gallery } from "./components/base/views/Gallery.ts";
import { GalleryCardView } from "./components/base/views/GalleryCardView"; 
import { Header } from "./components/base/views/Header"; 
import { ModalWindow } from "./components/base/views/ModalWindow"; 
import { ModalCardView } from "./components/base/views/ModalCardView"; 
import { BasketItem } from "./components/base/views/BasketItem"; 
import { BasketCardView } from "./components/base/views/BasketCardView"; 
import { OrderForm } from "./components/base/views/OrderForm";
import { ContactForm } from "./components/base/views/ContactForm";
import { OrderSuccess } from "./components/base/views/OrderSuccess";

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
  const galleryItems: HTMLElement[] = [];

  data.items.forEach(product => {
    const cardElement = cloneTemplate(cardCatalogTemplate);
    const cardView = new GalleryCardView(cardElement);

    cardView.title = product.title;
    cardView.price = product.price ?? 0;
    cardView.category = product.category;

    if (product.image) {
      cardView.image = CDN_URL + product.image;
    }

    cardView.element.addEventListener('click', () => {
      catalogModel.setSelectedProduct(product);
    });

    galleryItems.push(cardView.render());
  });

  gallery.catalog = galleryItems;

  header.counter = cartModel.getCount();
});

// Детальный просмотр
events.on('product:select', (data: {product: IProduct}) => {
  const product = data.product;

  const cardElement = cloneTemplate(cardPreviewTemplate);
  const modalCardView = new ModalCardView(events, cardElement);

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

// Нажатие кнопки открытия корзины 
events.on('basket:open', () => {
    const basketElement = cloneTemplate(basketTemplate);
    const basketView = new BasketItem(basketElement);
    
    const cartItems = cartModel.getItems();
    const itemElements: HTMLElement[] = [];

    if (cartItems.length > 0) {
        cartItems.forEach((product, index) => {
            const basketCardElement = cloneTemplate(cardBasketTemplate);
            const basketCardView = new BasketCardView(events, basketCardElement);
            
            basketCardView.title = product.title;
            basketCardView.price = product.price ?? 0;
            basketCardView.index = index + 1; 

            basketCardView.basketButton.addEventListener('click', () => {
                cartModel.removeItem(product.id);
                events.emit('basket:open'); 
            });

            itemElements.push(basketCardView.render());
        });
        
        basketView.list = itemElements;
        basketView.basketButton.disabled = false;
    } else {
        basketView.list = 'Корзина пуста';
        basketView.basketButton.disabled = true;
    }
    
    basketView.basketButton.addEventListener('click', () => {
        modal.close();
        events.emit('order:address');
    });

    modal.content = basketView.render();
    modal.open();
});

// Событие: переход к форме адреса и оплаты 
events.on('order:address', () => {
    buyerModel.clear(); 
    
    const orderElement = cloneTemplate(orderTemplate);
    const orderForm = new OrderForm(orderElement, events);
  
    const currentData = buyerModel.getData();
    
    orderForm.render({ payment: currentData.payment, address: currentData.address ?? '' });
    orderForm.submitButton = false; 

    orderForm.element.addEventListener('submit', (evt) => {
        evt.preventDefault();
        modal.close(); 
        events.emit('order:submit'); 
    });

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

// Переход к контактам 
events.on('order:submit', () => {
    
    const contactElement = cloneTemplate(contactTemplate);
    const contactForm = new ContactForm(contactElement);
    
    const currentData = buyerModel.getData();
    const errors = buyerModel.validate(); 

    contactForm.render({ 
        email: currentData.email ?? '', 
        phone: currentData.phone ?? '' 
    });
    
    contactForm.submitButton = !errors.email && !errors.phone; 

    contactForm.element.addEventListener('submit', (evt) => {
        evt.preventDefault();
        events.emit('contacts:submit'); 
    });

    modal.content = contactForm.render();
    modal.open();
});

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
            const successElement = cloneTemplate(successTemplate);
            const successView = new OrderSuccess(successElement);
            
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