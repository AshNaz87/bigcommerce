import {
  Binding,
  loadAutocomplete,
  relevantPage,
  config,
  autocompletePresent,
} from "@ideal-postcodes/jsutil";

// Load up available bindings
import * as checkout from "./checkout";
import * as account from "./account";
import * as register from "./register";
const bindings: Binding[] = [checkout, register, account];

const startInitTimer = () => setTimeout(init, 1000);

/**
 * Checks if page is relevant
 *
 * Loads required assets
 *
 * Starts plugin watcher when assets are available
 *
 * Starts bindings
 */
const init = (): unknown => {
  // Abort if any of the below guard clauses fail
  const c = config();
  if (c === undefined) return;
  if (!relevantPage(bindings)) return;

  // Retrieve assets
  loadAutocomplete(c);
  if (!autocompletePresent(window)) return startInitTimer();

  // Assets are ready
  return bindings.forEach((b) => b.start(c));
};

init();
