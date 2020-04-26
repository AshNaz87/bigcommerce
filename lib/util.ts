import { Selectors, TargetInputs } from "./types";
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
