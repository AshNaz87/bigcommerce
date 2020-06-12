import {idGen} from "@ideal-postcodes/jsutil";

export const createLookupElements = () => {
  const label = document.createElement("label");
  label.className = "form-label";
  label.innerText = "Search your Postcode";

  const input = document.createElement("input");
  input.type = "text";
  input.id = idGen();
  input.className = "form-input";
  input.setAttribute("autocomplete", "off");

  const dropdownContainer = document.createElement("div");
  dropdownContainer.id = idGen();

  const container = document.createElement("div");
  container.id = idGen();
  container.className =
    "form-field form-field--input formfield--inputText postcode-lookup";

  const button = document.createElement("input");
  button.type = "submit";
  button.value = "Find Address";
  button.className = "button button--primary";
  button.id = idGen();

  const br = document.createElement("br");

  container.appendChild(label);
  container.appendChild(input);
  container.appendChild(br.cloneNode());
  container.appendChild(button);
  container.appendChild(br.cloneNode());
  container.appendChild(dropdownContainer);

  return { input, container, dropdownContainer, button };
};
