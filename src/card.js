// card.js — модуль для работы с карточками

import { deleteCard, likeCard, unlikeCard } from "./api.js";
import { openDeleteConfirm } from "./index.js";

let currentUserId = null;

export function setCurrentUserId(id) {
  currentUserId = id;
}

export function createCard(cardData, handleImageClick) {
  const template = document.querySelector("#card-template").content;
  const cardElement = template.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Проверка, принадлежит ли карточка текущему пользователю
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = "none";
  } else {
    deleteButton.addEventListener("click", () => {
      openDeleteConfirm(cardElement, cardData._id);
    });
  }

  // Установка состояния лайка
  if (cardData.likes.some((user) => user._id === currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );

    const likeAction = isLiked ? unlikeCard : likeCard;

    likeAction(cardData._id)
      .then((updatedCard) => {
        likeButton.classList.toggle("card__like-button_is-active", !isLiked);
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch((err) => console.error(err));
  });

  cardImage.addEventListener("click", () => handleImageClick(cardData));

  return cardElement;
}
