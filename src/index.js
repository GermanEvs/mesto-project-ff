import "../pages/index.css";
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addCard,
  deleteCard,
  updateAvatar,
} from "./api.js";
import { createCard, setCurrentUserId } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import { enableValidation, clearValidation } from "./validate.js";

// DOM элементы
const placesList = document.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editModal = document.querySelector(".popup_type_edit");
const addModal = document.querySelector(".popup_type_new-card");
const confirmModal = document.querySelector(".popup_type_confirm");
const closeButtons = document.querySelectorAll(".popup__close");
const addForm = document.forms["new-place"];
const editForm = document.forms["edit-profile"];
const confirmForm = document.forms["confirm-delete"];
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");

// Для аватара
const avatarForm = document.forms["edit-avatar"];
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar-url");
const avatarPopup = document.querySelector(".popup_type_avatar");
const profileAvatar = document.querySelector(".profile__image");
const avatarEditButton = document.querySelector(".profile__avatar-edit-button");

// Переменные для удаления карточки
let cardToDelete = null;
let cardIdToDelete = null;

// Конфиг валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

// Функция изменения текста кнопки и блокировки
function renderLoading(button, isLoading, defaultText = "Сохранить") {
  if (isLoading) {
    button.textContent = "Сохранение...";
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}

// Загрузка данных пользователя и карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    setCurrentUserId(userData._id);
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;

    cards.reverse().forEach((cardData) => {
      const card = createCard(cardData, handleCardClick);
      placesList.append(card);
    });
  })
  .catch((err) => console.error("Ошибка при загрузке данных:", err));

// Открытие формы редактирования профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editModal);
});

// Открытие формы добавления карточки
addButton.addEventListener("click", () => {
  addForm.reset();
  clearValidation(addForm, validationConfig);
  openModal(addModal);
});

// Открытие попапа редактирования аватара
avatarEditButton.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// Отправка формы редактирования профиля
editForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitButton = editForm.querySelector(".popup__button");
  renderLoading(submitButton, true);

  const name = nameInput.value;
  const about = jobInput.value;

  updateUserInfo({ name, about })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editModal);
    })
    .catch((err) => console.error("Ошибка при обновлении профиля:", err))
    .finally(() => {
      renderLoading(submitButton, false);
    });
});

// Отправка формы добавления карточки
addForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitButton = addForm.querySelector(".popup__button");
  renderLoading(submitButton, true);

  const name = addForm.elements["place-name"].value;
  const link = addForm.elements["link"].value;

  addCard({ name, link })
    .then((newCard) => {
      const card = createCard(newCard, handleCardClick);
      placesList.prepend(card);
      closeModal(addModal);
      addForm.reset();
      clearValidation(addForm, validationConfig);
    })
    .catch((err) => console.error("Ошибка при добавлении карточки:", err))
    .finally(() => {
      renderLoading(submitButton, false);
    });
});

// Отправка формы подтверждения удаления карточки
confirmForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (!cardToDelete || !cardIdToDelete) return;

  deleteCard(cardIdToDelete)
    .then(() => {
      cardToDelete.remove();
      closeModal(confirmModal);
      cardToDelete = null;
      cardIdToDelete = null;
    })
    .catch((err) => console.error("Ошибка при удалении карточки:", err));
});

// Отправка формы обновления аватара
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitButton = avatarForm.querySelector(".popup__button");
  renderLoading(submitButton, true);

  const newAvatarUrl = avatarInput.value;

  updateAvatar(newAvatarUrl)
    .then((res) => {
      profileAvatar.style.backgroundImage = `url(${res.avatar})`;
      closeModal(avatarPopup);
    })
    .catch((err) => console.error("Ошибка при обновлении аватара:", err))
    .finally(() => {
      renderLoading(submitButton, false);
    });
});

// Открытие попапа изображения
function handleCardClick(cardData) {
  const imageModal = document.querySelector(".popup_type_image");
  const modalImage = imageModal.querySelector(".popup__image");
  const modalCaption = imageModal.querySelector(".popup__caption");

  modalImage.src = cardData.link;
  modalImage.alt = cardData.name;
  modalCaption.textContent = cardData.name;

  openModal(imageModal);
}

// Открытие попапа подтверждения удаления
export function openDeleteConfirm(cardElement, cardId) {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openModal(confirmModal);
}

// Закрытие всех попапов по крестику
closeButtons.forEach((button) => {
  const modal = button.closest(".popup");
  button.addEventListener("click", () => closeModal(modal));
});
