declare global {
  interface Window {
    IdealPostcodes: any;
    jQuery: any;
    idpcConfig: Config;
  }
}

import { Address } from "@ideal-postcodes/api-typings";

interface Config {
  apiKey: string;
  postcodeLookup: boolean;
  addressFinder: boolean;
}

interface Selectors {
  line_1: string;
  line_2: string;
  city: string;
  province: string;
  postcode: string;
}

interface TargetInputs {
  line_1: HTMLInputElement;
  line_2: HTMLInputElement;
  city: HTMLInputElement;
  province: HTMLInputElement;
  postcode: HTMLInputElement;
}

(function () {
  // Script & CSS Urls
  // const postcodeLookupUrl =
  //   "https://cdn.jsdelivr.net/npm/jquery-postcodes@3.0.8/dist/postcodes.min.js";
  const autocompleteUrl =
    "https://cdn.jsdelivr.net/npm/ideal-postcodes-autocomplete@0.2.1/dist/ideal-postcodes-autocomplete.min.js";
  // const jQueryUrl =
  //   "https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js";
  const autocompleteStyles =
    "https://cdn.jsdelivr.net/npm/ideal-postcodes-autocomplete@0.2.1/css/ideal-postcodes-autocomplete.css";

  /**
   * Load Autocomplete CSS
   */
  const loadAutocompleteStyles = () => {
    const link = loadStyle(autocompleteStyles);
    return head.appendChild(link);
  };

  /**
   * Load autocomplete plugin script
   */
  const loadAutocomplete = () => {
    const script = loadScript(autocompleteUrl);
    return head.appendChild(script);
  };

  /**
   * Inject CSS stylesheet
   */
  const loadStyle = (src: string): HTMLLinkElement => {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = src;
    return link;
  };

  /**
   * Inject script tag
   */
  const loadScript = (src: string): HTMLScriptElement => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    return script;
  };

  /**
   * Retrives a parent by tag name
   */
  const getParent = (node: HTMLElement, entity: string): HTMLElement | null => {
    let parent = node.parentNode as HTMLElement;
    if (parent === null) return null;
    const tagName = entity.toUpperCase();

    while (parent.tagName !== "HTML") {
      if (parent.tagName === tagName) return parent;
      if (parent.parentNode === null) return null;
      parent = parent.parentNode as HTMLElement;
    }
    return parent;
  };

  /**
   * Load jQuery plugin in head
   */
  // const loadJquery = () => {
  //   const script = loadScript(jQueryUrl);
  //   return head.appendChild(script);
  // };

  /**
   * Returns true unless search should be loaded on page
   */
  const shouldExit = (): boolean => {
    // Run if on valid page
    const url = window.location.href;
    let exit = true;
    // ("https://ideal-postcodes.mybigcommerce.com/account.php?action=add_shipping_address");
    // ("https://ideal-postcodes.mybigcommerce.com/login.php?action=create_account");
    // ("https://ideal-postcodes.mybigcommerce.com/account.php?action=edit_shipping_address&address_id=2&from=account.php%3Faction%3Daddress_book");
    ["/checkout"].forEach((e) => {
      if (url.indexOf(e) !== -1) exit = false;
    });

    // Check if config is present
    if (window.idpcConfig !== undefined) exit = false;

    return exit;
  };

  // Script insertion
  const head = document.head;

  /**
   * Returns true if Element is <input>
   */
  const isInput = (e: HTMLElement | null): e is HTMLInputElement => {
    if (e === null) return false;
    return e instanceof HTMLInputElement;
  };

  /**
   * Returns an object of attributes mapped to HTMLInputElement
   *
   * Returns null if any invalid selectors
   */

  const fetchInputs = (
    parent: HTMLElement,
    selectors: Selectors
  ): TargetInputs | null => {
    const line_1 = parent.querySelector(selectors.line_1) as HTMLElement;
    if (!isInput(line_1)) return null;

    const line_2 = parent.querySelector(selectors.line_2) as HTMLElement;
    if (!isInput(line_2)) return null;

    const city = parent.querySelector(selectors.city) as HTMLElement;
    if (!isInput(city)) return null;

    const province = parent.querySelector(selectors.province) as HTMLElement;
    if (!isInput(province)) return null;

    const postcode = parent.querySelector(selectors.postcode) as HTMLElement;
    if (!isInput(postcode)) return null;

    return {
      line_1,
      line_2,
      city,
      province,
      postcode,
    };
  };

  // Returns true if initialised
  const loaded = (elem: HTMLElement): boolean =>
    elem.getAttribute("idpc") === "true";

  // Marks input as loaded
  const markLoaded = (elem: HTMLElement) => elem.setAttribute("idpc", "true");

  /**
   * Updates input value and dispatches change envet
   */
  const update = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event("change"));
  };

  /**
   * Formats address into concatenated line_2
   */
  const toLine2 = (address: Address): string => {
    if (address.line_2.length === 0) return "";
    if (address.line_3.length === 0) return address.line_2;
    return address.line_2 + ", " + address.line_3;
  };

  const CHECKOUT_BINDINGS: Selectors = {
    line_1: "#addressLine1Input",
    line_2: "#addressLine2Input",
    city: "#cityInput",
    province: "#provinceInput",
    postcode: "#postCodeInput",
  };

  /**
   * Look for line 1 and bind if present
   */
  const initCheckoutAddress = () => {
    const line_1 = document.querySelector(
      CHECKOUT_BINDINGS.line_1
    ) as HTMLInputElement;

    // Exit if input not found
    if (line_1 === null) return;
    // Exit if plugin already initialised on input
    if (loaded(line_1)) return;

    // Tag form as loaded
    markLoaded(line_1);

    // Retrieve other fields by scoping to parent
    const parent = getParent(line_1, "fieldset");
    if (!parent) return;

    const inputs = fetchInputs(parent, CHECKOUT_BINDINGS);
    if (inputs === null) return;

    const idpcConfig = window.idpcConfig;

    // Initialise autocomplete instance
    new window.IdealPostcodes.Autocomplete.Controller({
      api_key: idpcConfig.apiKey,
      inputField: CHECKOUT_BINDINGS.line_1,
      outputFields: {},
      onAddressRetrieved: (address: Address) => {
        update(inputs.line_1, address.line_1);
        update(inputs.line_2, toLine2(address));
        update(inputs.city, address.post_town);
        update(inputs.province, address.county);
        update(inputs.postcode, address.postcode);
      },
    });
  };

  // Exit if current page not applicable
  if (shouldExit()) return;

  // Retrieve assets
  loadAutocomplete();
  loadAutocompleteStyles();

  const startInitTimer = () => setTimeout(init, 1000);

  /**
   * Loads required assets
   *
   * Starts plugin watcher when assets are available
   */
  const init = () => {
    if (window.IdealPostcodes === undefined) return startInitTimer();
    if (window.IdealPostcodes.Autocomplete === undefined)
      return startInitTimer();
    if (window.IdealPostcodes.Autocomplete.Controller === undefined)
      return startInitTimer();
    // Listen for checkout
    setInterval(initCheckoutAddress, 1000);
    return;
  };

  startInitTimer();
})();
