import { Address } from "@ideal-postcodes/api-typings";
import {
  update,
  loaded,
  markLoaded,
  getParent,
  fetchInputs,
  toLine2,
} from "./util";
import { Binding, Config } from "./types";

export const pageTest = (): boolean =>
  window.location.pathname.includes("/checkout");

export const selectors = {
  line_1: "#addressLine1Input",
  line_2: "#addressLine2Input",
  post_town: "#cityInput",
  county: "#provinceInput",
  postcode: "#postCodeInput",
  organisation: "#",
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

  // Fetch input fields, abort if key inputs are not present
  const inputs = fetchInputs(parent, selectors);
  if (inputs.line_1 === null) return;
  if (inputs.post_town === null) return;
  if (inputs.postcode === null) return;

  // Initialise autocomplete instance
  new window.IdealPostcodes.Autocomplete.Controller({
    api_key: config.apiKey,
    inputField: selectors.line_1,
    outputFields: {},
    onAddressRetrieved: (address: Address) => {
      update(inputs.line_1, address.line_1);
      update(inputs.line_2, toLine2(address));
      update(inputs.post_town, address.post_town);
      update(inputs.county, address.county);
      update(inputs.postcode, address.postcode);
      if (config.populateOrganisation)
        update(inputs.organisation, address.organisation_name);
    },
    ...config.autocompleteOverride,
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
