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
  const pageBindings = setupBind({ selectors });

  pageBindings.forEach(binding => {
    const { anchor, targets } = binding;

    if (config.autocomplete) {
      // Initialise autocomplete instance
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
  })
};

export const binding: Binding = {
  pageTest,
  bind
};
