// utils.js

let currentUserId = null;

export function setCurrentUserId(id) {
  currentUserId = id;
}

export function getCurrentUserId() {
  return currentUserId;
}

export function renderLoading(button, isLoading, defaultText = "Сохранить") {
  if (isLoading) {
    button.textContent = "Сохранение...";
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}
