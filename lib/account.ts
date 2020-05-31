import {
  addressRetrieval,
  getTargets,
  generateTimer,
  getAnchor,
  getParent,
  Binding,
  Config,
} from "@ideal-postcodes/jsutil";

import { insertBefore, createLookupElements } from "./bigcommerce";

export const pageTest = (): boolean =>
  window.location.pathname.includes("/account.php");

export const selectors = {
  line_1: "#FormField_8_input",
  line_2: "#FormField_9_input",
  post_town: "#FormField_10_input",
  county: "#FormField_12_input",
  postcode: "#FormField_13_input",
  organisation: "#FormField_6_input",
  country: "#FormField_11_select",
};

const toId = (elem: HTMLElement): string => `#${elem.id}`;

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
  if (config.autocomplete) {
    new window.IdealPostcodes.Autocomplete.Controller({
      api_key: config.apiKey,
      inputField: selectors.line_1,
      outputFields: {},
      checkKey: true,
      onAddressRetrieved: addressRetrieval({ targets, config }),
      ...config.autocompleteOverride,
    });
  }

  if (config.postcodeLookup) {
    const {
      container,
      input,
      dropdownContainer,
      button,
    } = createLookupElements();

    const anchorParent = anchor.parentNode;
    if (anchorParent === null) return;
    insertBefore({ elem: container, target: anchorParent as HTMLElement });

    (jQuery as any)(toId(container)).setupPostcodeLookup({
      api_key: config.apiKey,
      onAddressSelected: addressRetrieval({ targets, config }),
      input: toId(input),
      output_fields: {},
      button: toId(button),
      dropdownContainer: toId(dropdownContainer),
      dropdownClass: "form-select",
      ...config.postcodeLookupOverride,
    });
  }
};

export const { start, stop } = generateTimer({ pageTest, bind });

export const binding: Binding = {
  pageTest,
  selectors,
  bind,
  start,
  stop,
};
