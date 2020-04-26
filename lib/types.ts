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
  city: string;
  province: string;
  postcode: string;
}

export interface Config {
  /**
   * Key to access service
   */
  apiKey: string;
  /**
   * Overrides generated attributes for autocomplete
   */
  autocompleteOverride?: AutocompleteConfig;
  postcodeLookup: boolean;
  addressFinder: boolean;
}

export interface TargetInputs {
  line_1: HTMLInputElement;
  line_2: HTMLInputElement;
  city: HTMLInputElement;
  province: HTMLInputElement;
  postcode: HTMLInputElement;
}

/**
 *  Placeholder
 */
export type AutocompleteConfig = object;
