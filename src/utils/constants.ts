/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
// Бэкенд и CDN приходят из Vite-окружения; если переменные не заданы (локальная разработка),
// используем публичный хост номорпартиеc, чтобы не получать HTML вместо JSON.
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? 'https://larek-api.nomoreparties.co';

export const API_URL = `${API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

/* Константа соответствий категорий товара модификаторам для фона карточки. */
export const cardCategoryMap = {
  'софт-скил': 'card_soft',
  'хард-скил': 'card_hard',
  'кнопка': 'card_button',
  'дополнительное': 'card_additional',
  'другое': 'card_other',
};

export const settings = {

};

