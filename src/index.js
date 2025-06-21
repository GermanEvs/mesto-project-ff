import "../pages/index.css";
import {
  initialCards,
  createCard,
  handleDeleteCard,
  handleCardClick,
} from "./cards.js";
import { openModal, closeModal } from "./modal.js";

// DOM узлы
const placesList = document.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editModal = document.querySelector(".popup_type_edit");
const addModal = document.querySelector(".popup_type_new-card");
const closeButtons = document.querySelectorAll(".popup__close");
const addForm = document.forms["new-place"];

// Добавление начальных карточек
initialCards.forEach((cardData) => {
  const card = createCard(cardData, handleDeleteCard, handleCardClick);
  placesList.append(card);
});

// Обработчик добавления новой карточки
function handleAddFormSubmit(evt) {
  evt.preventDefault();

  const cardData = {
    name: addForm.elements["place-name"].value,
    link: addForm.elements.link.value,
  };

  const card = createCard(cardData, handleDeleteCard, handleCardClick);
  placesList.prepend(card);

  closeModal(addModal);
  addForm.reset();
}

// Форма редактирования профиля
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const editForm = document.forms["edit-profile"];
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");

// Вешаем обработчики
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editModal);
});

addButton.addEventListener("click", () => openModal(addModal));
addForm.addEventListener("submit", handleAddFormSubmit);
editForm.addEventListener("submit", handleEditFormSubmit);

closeButtons.forEach((button) => {
  const modal = button.closest(".popup");
  button.addEventListener("click", () => closeModal(modal));
});

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editModal);
}
