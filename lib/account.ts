import {
  addressRetrieval,
  Binding,
  Config,
  toId,
  setupBind,
  insertBefore,
} from "@ideal-postcodes/jsutil";

import {
  createLookupElements,
} from "./bigcommerce";

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

export const bind = (config: Config) => {
  const pageBindings = setupBind({ selectors });

  pageBindings.forEach(binding => {
    const { anchor, targets } = binding;

    // Initialise autocomplete instance
    if (config.autocomplete) {
      // Cancel any float on input
      anchor.setAttribute(
        "style",
        (anchor.getAttribute("style") || "") + "; float: none;"
      );

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
        check_key: true,
        button: toId(button),
        dropdown_container: toId(dropdownContainer),
        dropdown_class: "form-select",
        ...config.postcodeLookupOverride,
      });
    }
  });
};

export const binding: Binding = {
  pageTest,
  bind
};
