import { Binding } from "./types";
import { relevantPage, loadAutocomplete, config } from "./util";

// Load up available bindings
import * as checkout from "./checkout";
import * as account from "./account";
const bindings: Binding[] = [checkout, account];

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
  // Exit if any of the below guard clauses fail
  const c = config();
  if (c === undefined) return;
  if (!relevantPage(bindings)) return;

  // Retrieve assets
  loadAutocomplete();

  // Check if assets present, if not, try again later
  if (window.IdealPostcodes === undefined) return startInitTimer();
  if (window.IdealPostcodes.Autocomplete === undefined) return startInitTimer();
  if (window.IdealPostcodes.Autocomplete.Controller === undefined)
    return startInitTimer();

  // When assets ready, apply bindings
  return bindings.forEach((b) => b.start(c));
};

init();
