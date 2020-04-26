declare global {
  interface Window {
    IdealPostcodes: any;
    jQuery: any;
    idpcConfig: Config;
  }
}

import { Config, Selectors, TargetInputs, Binding } from "./types";
import { Address } from "@ideal-postcodes/api-typings";

/**
 * Returns true if initialised
 */
export const loaded = (elem: HTMLElement): boolean =>
  elem.getAttribute("idpc") === "true";

/**
 *  Marks input as loaded
 */
export const markLoaded = (elem: HTMLElement) =>
  elem.setAttribute("idpc", "true");

/**
 * Retrives a parent by tag name
 */
export const getParent = (
  node: HTMLElement,
  entity: string
): HTMLElement | null => {
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
 * Returns an object of attributes mapped to HTMLInputElement
 *
 * Returns null if any invalid selectors
 */
export const fetchInputs = (
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

  return { line_1, line_2, city, province, postcode };
};

/**
 * Returns true if Element is <input>
 */
const isInput = (e: HTMLElement | null): e is HTMLInputElement => {
  if (e === null) return false;
  return e instanceof HTMLInputElement;
};

/**
 * Updates input value and dispatches change envet
 */
export const update = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event("change"));
};

/**
 * Formats address into concatenated line_2
 */
export const toLine2 = (address: Address): string => {
  if (address.line_2.length === 0) return "";
  if (address.line_3.length === 0) return address.line_2;
  return address.line_2 + ", " + address.line_3;
};

export const relevantPage = (bindings: Binding[]): boolean =>
  bindings.some((b) => b.pageTest());

const head = document.head;

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
export const loadAutocomplete = () => {
  loadAutocompleteStyles();
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

export const config = (): Config | undefined => window.idpcConfig;
