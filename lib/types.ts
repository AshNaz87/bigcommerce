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

interface Start {
  (config: Config): number | null;
}

interface Stop {
  (): void;
}

interface Bind {
  (config: Config): void;
}

interface PageTest {
  (): boolean;
}

export interface Selectors {
  line_1: string;
  line_2: string;
  post_town: string;
  county: string;
  postcode: string;
  organisation: string;
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
}

/**
 *  Placeholder
 */
export type AutocompleteConfig = object;
