/* tslint:disable:no-shadowed-variable */
declare global {
  interface Window {
    IdealPostcodes: any;
    jQuery: any;
    idpcConfig: Partial<Config>;
  }
}

import {
  Country,
  ChannelIslandIso,
  CountryIso,
  Bind,
  Start,
  Stop,
  PageTest,
  Config,
  Selectors,
  Targets,
  Binding,
} from "./types";
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
 * Returns null if any critical elements are not present (line 1, post_town, postcode)
 */
export const getTargets = (
  parent: HTMLElement,
  selectors: Selectors
): Targets | null => {
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
  const country: HTMLElement | null = parent.querySelector(selectors.country);

  if (line_1 === null) return null;
  if (post_town === null) return null;
  if (postcode === null) return null;

  return { line_1, line_2, post_town, county, postcode, organisation, country };
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
  change(input, value);
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

/**
 * Converts Channel Island Country to Channel Island SO
 */
const toCiIso = (address: Address): ChannelIslandIso | null => {
  if (/^GY/.test(address.postcode)) return "GG";
  if (/^JE/.test(address.postcode)) return "JE";
  return null;
};

/**
 * Converts a country to its ISO code
 */
const toIso = (address: Address): CountryIso | null => {
  const country: Country = address.country as Country;
  if (country === "England") return "GB";
  if (country === "Scotland") return "GB";
  if (country === "Wales") return "GB";
  if (country === "Northern Ireland") return "GB";
  if (country === IOM) return "IM";
  if (country === "Channel Islands") return toCiIso(address);
  return null;
};

const UK = "United Kingdom";
const IOM = "Isle of Man";

const hasValue = (select: HTMLSelectElement, value: string | null): boolean => {
  if (value === null) return false;
  return select.querySelector(`[value="${value}"]`) !== null;
};

type BcCountry = "United Kingdom" | "Jersey" | "Guernsey" | "Isle of Man";

/**
 *  BigCommerce specific country name
 */
const toBcCountry = (address: Address): BcCountry | null => {
  const country: Country = address.country as Country;
  if (country === "England") return UK;
  if (country === "Scotland") return UK;
  if (country === "Wales") return UK;
  if (country === "Northern Ireland") return UK;
  if (country === IOM) return IOM;
  if (country === "Channel Islands") {
    const iso = toCiIso(address);
    if (iso === "GG") return "Guernsey";
    if (iso === "JE") return "Jersey";
  }
  return null;
};

/**
 * Updates country in BC country field given address selected
 */
export const updateCountry = (select: HTMLElement | null, address: Address) => {
  if (!select) return;
  if (!isSelect(select)) return;

  const iso = toIso(address);
  if (hasValue(select, iso)) change(select, iso);

  const bcc = toBcCountry(address);
  if (hasValue(select, bcc)) change(select, bcc);
};

const change = (
  e: HTMLInputElement | HTMLSelectElement,
  value: string | null
) => {
  if (value === null) return;
  e.value = value;
  e.dispatchEvent(new Event("change"));
};

interface Options {
  targets: Targets;
  config: Config;
}

interface Handler {
  (address: Address): void;
}

interface AddressRetrieval {
  (options: Options): Handler;
}

export const addressRetrieval: AddressRetrieval = ({ targets, config }) => (
  address
) => {
  update(targets.line_1, address.line_1);
  update(targets.line_2, toLine2(address));
  update(targets.post_town, address.post_town);
  update(targets.county, address.county);
  update(targets.postcode, address.postcode);
  updateCountry(targets.country, address);
  if (config.populateOrganisation)
    update(targets.organisation, address.organisation_name);
};
/**
 * Returns true if element is select
 */
const isSelect = (e: HTMLElement | null): e is HTMLSelectElement => {
  if (e === null) return false;
  return e instanceof HTMLSelectElement;
};

interface GenerateTimerOptions {
  pageTest: PageTest;
  bind: Bind;
}

interface TimerControls {
  start: Start;
  stop: Stop;
}

interface GenerateTimer {
  (options: GenerateTimerOptions): TimerControls;
}

export const generateTimer: GenerateTimer = ({ pageTest, bind }) => {
  let timer: number | null = null;

  const start = (config: Config): number | null => {
    if (!pageTest()) return null;
    timer = window.setInterval(() => {
      try {
        bind(config);
      } catch (e) {
        // Terminate timer if some exception is raised
        stop();
        /* eslint no-console: ["error", { allow: ["log"] }] */
        console.log(e);
      }
    }, 1000);
    return timer;
  };

  const stop = () => {
    if (timer === null) return;
    window.clearInterval(timer);
    timer = null;
  };

  return { start, stop };
};

/**
 * Retrieves an anchor defined by a query selector
 *
 * Checks if anchor has been loaded, if not, marks it as loaded
 */
export const getAnchor = (selector: string): HTMLElement | null => {
  const anchor = document.querySelector(selector) as HTMLInputElement;
  if (anchor === null) return null;
  if (loaded(anchor)) return null;
  markLoaded(anchor);
  return anchor;
};
