import {
  getAnchor,
  getParent,
  getTargets,
  addressRetrieval,
  generateTimer,
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
  organisation: "#companyInput",
  country: "#countryCodeInput",
};

export const bind = (config: Config) => {
  const anchor = getAnchor(selectors.line_1) as HTMLInputElement;
  if (anchor === null) return;

  // Retrieve other fields by scoping to parent
  const parent = getParent(anchor, "fieldset");
  if (!parent) return;

  // Fetch input fields, abort if key inputs are not present
  const targets = getTargets(parent, selectors);
  if (targets === null) return;

  // Initialise autocomplete instance
  new window.IdealPostcodes.Autocomplete.Controller({
    api_key: config.apiKey,
    inputField: selectors.line_1,
    outputFields: {},
    checkKey: true,
    onAddressRetrieved: addressRetrieval({ targets, config }),
    ...config.autocompleteOverride,
  });
};

export const { start, stop } = generateTimer({ pageTest, bind });

export const binding: Binding = {
  pageTest,
  selectors,
  bind,
  start,
  stop,
};
