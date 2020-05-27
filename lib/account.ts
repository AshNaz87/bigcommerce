import {
  addressRetrieval,
  getTargets,
  generateTimer,
  getAnchor,
  getParent,
  Binding,
  Config,
} from "@ideal-postcodes/jsutil";

export const pageTest = (): boolean => {
  if (window.location.pathname.includes("/login.php")) return true;
  return window.location.pathname.includes("/account.php");
};

export const selectors = {
  line_1: "#FormField_8_input",
  line_2: "#FormField_9_input",
  post_town: "#FormField_10_input",
  county: "#FormField_12_input",
  postcode: "#FormField_13_input",
  organisation: "#FormField_6_input",
  country: "#FormField_11_select",
};

export const bind = (config: Config) => {
  const anchor = getAnchor(selectors.line_1) as HTMLInputElement;
  if (anchor === null) return;

  // Cancel any float on input
  anchor.setAttribute(
    "style",
    (anchor.getAttribute("style") || "") + "; float: none;"
  );

  // Retrieve other fields by scoping to parent
  const parent = getParent(anchor, "fieldset");
  if (!parent) return;

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
