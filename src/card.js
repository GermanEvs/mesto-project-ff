export function createCard(
  cardData,
  handleDelete,
  toggleLike,
  handleImageClick
) {
  const template = document.querySelector("#card-template").content;
  const cardElement = template.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener("click", () => handleDelete(cardElement));
  likeButton.addEventListener("click", toggleLike);
  cardImage.addEventListener("click", () => handleImageClick(cardData));

  return cardElement;
}

/**
 * Удаляет карточку из DOM
 * @param {HTMLElement} cardElement - DOM-элемент карточки для удаления
 */
export function handleDeleteCard(cardElement) {
  cardElement.remove();
}
