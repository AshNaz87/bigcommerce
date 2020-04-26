export interface Binding {
  /**
   * Target input fields
   */
  selectors: Selectors;
  /**
   * Verify if can be launched
   */
  pageTest: PageTest;
  /**
   * Binds to page
   */
  bind: Bind;
  /**
   * Starts page watcher, waits to bind to address field
   *
   * Does not start if page test fails
   */
  start: Start;
  /**
   * Stops page watcher
   */
  stop: Stop;
}

export interface Start {
  (config: Config): number | null;
}

export interface Stop {
  (): void;
}

export interface Bind {
  (config: Config): void;
}

export interface PageTest {
  (): boolean;
}

export interface Selectors {
  line_1: string;
  line_2: string;
  post_town: string;
  county: string;
  postcode: string;
  organisation: string;
  country: string;
}

export interface Config {
  /**
   * Key to access service
   */
  apiKey: string;
  /**
   * Overrides generated attributes for autocomplete
   */
  autocompleteOverride: AutocompleteConfig;
  /**
   * Populate organisation from address
   */
  populateOrganisation: boolean;
}

export interface Targets {
  line_1: HTMLElement | null;
  line_2: HTMLElement | null;
  post_town: HTMLElement | null;
  county: HTMLElement | null;
  postcode: HTMLElement | null;
  organisation: HTMLElement | null;
  country: HTMLElement | null;
}

/**
 *  Placeholder
 */
export type AutocompleteConfig = object;

/**
 *  Countries returned by API
 */
export type Country =
  | "England"
  | "Wales"
  | "Northern Ireland"
  | "Scotland"
  | "Channel Islands"
  | "Isle of Man";

/**
 * Channel Island ISO Codes
 */
export type ChannelIslandIso = "JE" | "GG";

/**
 * Countries recognised by bigcommerce
 */
export type CountryIso = "GB" | "IM" | ChannelIslandIso;
