import { Binding, Config } from "./types";
import * as checkout from "./checkout";

declare global {
  interface Window {
    IdealPostcodes: any;
    jQuery: any;
    idpcConfig: Config;
  }
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
   * Returns true if account page
   */
  // const isAccount = (): boolean =>
  //   window.location.pathname.includes("/account");

  /**
   * Returns true if config detected
   */
  const hasConfig = (): boolean => window.idpcConfig !== undefined;

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
    // Exit if no config
    if (hasConfig() === false) return false;

    // Run if on valid page
    const relevantPage = [checkout].some((b) => b.pageTest());
    if (relevantPage === false) return true;

    return false;
  };

  // Script insertion
  const head = document.head;

  const bindings: Binding[] = [checkout];

  const startInitTimer = () => setTimeout(init, 1000);

  /**
   * Loads required assets
   *
   * Starts plugin watcher when assets are available
   */
  const init = (): unknown => {
    // Exit and don't re-init
    if (shouldExit()) return;

    // Retrieve assets
    loadAutocomplete();
    loadAutocompleteStyles();

    // Check if assets present, if not, try again later
    if (window.IdealPostcodes === undefined) return startInitTimer();
    if (window.IdealPostcodes.Autocomplete === undefined)
      return startInitTimer();
    if (window.IdealPostcodes.Autocomplete.Controller === undefined)
      return startInitTimer();

    const config = window.idpcConfig;

    // When assets ready, apply bindings
    bindings.forEach((b) => b.start(config));

    return;
  };
  init();
})();
