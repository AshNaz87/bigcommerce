import { Address } from "@ideal-postcodes/api-typings";
import {
  update,
  loaded,
  markLoaded,
  getParent,
  autocompleteOverride,
  fetchInputs,
  toLine2,
} from "./util";
import { Binding, Config } from "./types";

export const pageTest = (): boolean => {
  if (window.location.pathname.includes("/login.php")) return true;
  return window.location.pathname.includes("/account.php");
};

export const selectors = {
  line_1: "#FormField_8_input",
  line_2: "#FormField_9_input",
  city: "#FormField_10_input",
  province: "#FormField_12_input",
  postcode: "#FormField_13_input",
};

export const bind = (config: Config) => {
  const line_1 = document.querySelector(selectors.line_1) as HTMLInputElement;

  // Exit if input not found
  if (line_1 === null) return;
  // Exit if plugin already initialised on input
  if (loaded(line_1)) return;

  // Tag form as loaded
  markLoaded(line_1);

  // Retrieve other fields by scoping to parent
  const parent = getParent(line_1, "fieldset");
  if (!parent) return;

  const inputs = fetchInputs(parent, selectors);
  if (inputs === null) return;

  // Initialise autocomplete instance
  new window.IdealPostcodes.Autocomplete.Controller({
    api_key: config.apiKey,
    inputField: selectors.line_1,
    outputFields: {},
    onAddressRetrieved: (address: Address) => {
      update(inputs.line_1, address.line_1);
      update(inputs.line_2, toLine2(address));
      update(inputs.city, address.post_town);
      update(inputs.province, address.county);
      update(inputs.postcode, address.postcode);
    },
    ...autocompleteOverride(config),
  });
};

let timer: number | null = null;

export const start = (config: Config): number | null => {
  if (pageTest() === false) return null;
  timer = window.setInterval(() => bind(config), 1000);
  return timer;
};

export const stop = () => {
  if (timer === null) return;
  window.clearInterval(timer);
  timer = null;
};

export const binding: Binding = {
  pageTest,
  selectors,
  bind,
  start,
  stop,
};
