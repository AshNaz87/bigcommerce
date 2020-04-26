declare global {
  interface Window {
    IdealPostcodes: any;
    jQuery: any;
    idpcConfig: Partial<Config>;
  }
}

import { Config, Selectors, Targets, Binding } from "./types";
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
): Targets => {
  const line_1: HTMLElement | null = parent.querySelector(selectors.line_1);
  const line_2: HTMLElement | null = parent.querySelector(selectors.line_2);
  const post_town: HTMLElement | null = parent.querySelector(
    selectors.post_town
  );
  const county: HTMLElement | null = parent.querySelector(selectors.county);
  const postcode: HTMLElement | null = parent.querySelector(selectors.postcode);
  const organisation: HTMLElement | null = parent.querySelector(
    selectors.organisation
  );

  return { line_1, line_2, post_town, county, postcode, organisation };
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
export const update = (input: HTMLElement | null, value: string) => {
  if (!input) return;
  if (!isInput(input)) return;
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
const autocompleteIntegrity =
  "sha256-lZPaPHBx7V2Gj9iAc8QfVcW02KlWB2gbrqXpGfiEGgo=";
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
  const script = loadScript(autocompleteUrl, autocompleteIntegrity);
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
const loadScript = (src: string, integrity?: string): HTMLScriptElement => {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.crossOrigin = "anonymous";
  if (integrity) script.integrity = integrity;
  script.src = src;
  return script;
};

const defaults: Config = {
  apiKey: "",
  populateOrganisation: true,
  autocompleteOverride: {},
};

export const config = (): Config | undefined => {
  const c = window.idpcConfig;
  if (c === undefined) return;
  return { ...defaults, ...c };
};
