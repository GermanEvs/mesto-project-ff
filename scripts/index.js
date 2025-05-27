// @todo: Темплейт карточки
function createCard(cardData, handleDelete) {
  const template = document.querySelector("#card-template").content;
  const cardElement = template.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener("click", () => handleDelete(cardElement));

  return cardElement;
}
// @todo: Функция удаления карточки
function handleDeleteCard(cardElement) {
  cardElement.remove();
}
// @todo: DOM узлы
const placesList = document.querySelector(".places__list");
// @todo: Функция создания карточки
initialCards.forEach((cardData) => {
  const card = createCard(cardData, handleDeleteCard);
  placesList.appendChild(card);
});
