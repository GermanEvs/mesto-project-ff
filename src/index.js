import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, handleDeleteCard } from "./card.js";
import { openModal, closeModal } from "./modal.js";

function toggleLike(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

function handleCardClick(cardData) {
  const imageModal = document.querySelector(".popup_type_image");
  const modalImage = imageModal.querySelector(".popup__image");
  const modalCaption = imageModal.querySelector(".popup__caption");

  modalImage.src = cardData.link;
  modalImage.alt = cardData.name;
  modalCaption.textContent = cardData.name;

  openModal(imageModal);
}

function handleAddFormSubmit(evt) {
  evt.preventDefault();

  const cardData = {
    name: addForm.elements["place-name"].value,
    link: addForm.elements.link.value,
  };

  const card = createCard(
    cardData,
    handleDeleteCard,
    toggleLike,
    handleCardClick
  );

  placesList.prepend(card);
  closeModal(addModal);
  addForm.reset();
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editModal);
}

// ========== Инициализация ==========

// DOM элементы
const placesList = document.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editModal = document.querySelector(".popup_type_edit");
const addModal = document.querySelector(".popup_type_new-card");
const closeButtons = document.querySelectorAll(".popup__close");
const addForm = document.forms["new-place"];
const editForm = document.forms["edit-profile"];
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");

// Добавление начальных карточек
initialCards.forEach((cardData) => {
  const card = createCard(
    cardData,
    handleDeleteCard,
    toggleLike,
    handleCardClick
  );
  placesList.append(card);
});

// Обработчики событий
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
