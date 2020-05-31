import {
  loadAutocomplete,
  config,
  relevantPage,
  loadPostcodeLookup,
  Binding,
  Config,
  postcodeLookupPresent,
  autocompletePresent,
} from "@ideal-postcodes/jsutil";

interface InsertBeforeOptions {
  elem: HTMLElement;
  target: HTMLElement;
}

interface InsertBefore {
  (options: InsertBeforeOptions): HTMLElement | undefined;
}

/**
 * Inserts element before `target` element
 */
export const insertBefore: InsertBefore = ({ elem, target }) => {
  const parent = target.parentNode;
  if (parent === null) return;
  parent.insertBefore(elem, target);
  return elem;
};

interface IdGen {
  (): string;
}

/**
 * Generates an IDPC id
 */
const idGen: IdGen = (() => {
  let counter = 1;
  return (): string => `idpc_${(counter += 1)}`;
})();

export const createLookupElements = () => {
  const label = document.createElement("label");
  label.className = "form-label";
  label.innerText = "Search your Postcode";

  const input = document.createElement("input");
  input.type = "text";
  input.id = idGen();
  input.className = "form-input";
  input.setAttribute("autocomplete", "off");

  const dropdownContainer = document.createElement("div");
  dropdownContainer.id = idGen();

  const container = document.createElement("div");
  container.id = idGen();
  container.className =
    "form-field form-field--input formfield--inputText postcode-lookup";

  const button = document.createElement("input");
  button.type = "submit";
  button.value = "Lookup Address";
  button.className = "button button--primary";
  button.id = idGen();

  const br = document.createElement("br");

  container.appendChild(label);
  container.appendChild(input);
  container.appendChild(br.cloneNode());
  container.appendChild(button);
  container.appendChild(br.cloneNode());
  container.appendChild(dropdownContainer);

  return { input, container, dropdownContainer, button };
};

interface Options {
  config: Config;
  window: Window;
}

interface ReadyAssets {
  (options: Options): boolean;
}

/**
 * Returns true if all necessary assets are available
 *
 * If false, asset retrieval will be trigered
 */
export const readyAssets: ReadyAssets = ({ config, window }) => {
  let ready = true;

  // Retrieve assets
  if (config.autocomplete) {
    loadAutocomplete(config);
    if (!autocompletePresent(window)) ready = false;
  }

  if (config.postcodeLookup) {
    loadPostcodeLookup(config);
    if (!postcodeLookupPresent(window)) ready = false;
  }

  return ready;
};

interface SetupOptions {
  window: Window;
  bindings: Binding[];
}

interface Setup {
  (options: SetupOptions): void;
}

/**
 * Deploys address search tools on page using predefined bindings
 */
export const setup: Setup = ({ window, bindings }) => {
  const c = config();
  if (c === undefined) return;
  if (!relevantPage(bindings)) return;
  if (!readyAssets({ config: c, window }))
    return setTimeout(() => setup({ window, bindings }), 1000);
  return bindings.forEach((b) => b.start(c));
};
