export function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => setEventListeners(form, settings));
}

function setEventListeners(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputs, button, settings);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, settings);
      toggleButtonState(inputs, button, settings);
    });
  });
}

function checkInputValidity(form, input, settings) {
  const errorElement = form.querySelector(`#${input.name}-error`);
  const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

  const requiresRegex = ["name", "description", "place-name"].includes(
    input.name
  );

  if (!input.validity.valid) {
    showInputError(input, errorElement, input.validationMessage, settings);
  } else if (requiresRegex && !regex.test(input.value)) {
    const customMessage = input.dataset.errorText || "Недопустимый формат";
    showInputError(input, errorElement, customMessage, settings);
  } else {
    hideInputError(input, errorElement, settings);
  }
}

function showInputError(input, errorElement, message, settings) {
  input.classList.add(settings.inputErrorClass);
  errorElement.textContent = message;
  errorElement.classList.add(settings.errorClass);
}

function hideInputError(input, errorElement, settings) {
  input.classList.remove(settings.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
}

function toggleButtonState(inputs, button, settings) {
  const hasInvalid = inputs.some((input) => {
    const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
    if (!input.validity.valid) return true;

    if (["name", "description", "place-name"].includes(input.name)) {
      return !regex.test(input.value);
    }

    return false; // для остальных — достаточно проверки validity
  });

  button.disabled = hasInvalid;
  button.classList.toggle(settings.inactiveButtonClass, hasInvalid);
}

export function clearValidation(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    const errorElement = form.querySelector(`#${input.name}-error`);
    hideInputError(input, errorElement, settings);
  });

  toggleButtonState(inputs, button, settings);
}
