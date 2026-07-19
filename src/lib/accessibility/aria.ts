/**
 * Generates ARIA attributes for form errors.
 *
 * @param isInvalid Boolean indicating if the input is currently invalid
 * @param errorId The ID of the element containing the error message
 * @returns Object containing `aria-invalid` and `aria-describedby` props
 */
export function buildErrorAttributes(isInvalid: boolean, errorId?: string) {
  if (!isInvalid || !errorId) {
    return {
      'aria-invalid': false,
    };
  }

  return {
    'aria-invalid': true,
    'aria-describedby': errorId,
  };
}

/**
 * Generates HTML attributes for linking a label to an input.
 * Useful when rendering custom label and input components side-by-side.
 *
 * @param id The unique ID for the input element
 * @returns Object containing `htmlFor` and `id` props
 */
export function buildLabelAttributes(id: string) {
  return {
    labelProps: { htmlFor: id },
    inputProps: { id },
  };
}

/**
 * Generates ARIA attributes for describing an element.
 *
 * @param descriptionId The ID of the element containing the description
 * @returns Object containing `aria-describedby` prop
 */
export function buildDescriptionAttributes(descriptionId?: string) {
  if (!descriptionId) return {};

  return {
    'aria-describedby': descriptionId,
  };
}

/**
 * Generates an accessible name via aria-label or aria-labelledby.
 * Falls back safely if neither is provided.
 *
 * @param label A string to be used as `aria-label`
 * @param labelledBy An ID to be used as `aria-labelledby`
 * @returns Object containing the appropriate ARIA naming prop
 */
export function buildAccessibleName(label?: string, labelledBy?: string) {
  if (labelledBy) {
    return { 'aria-labelledby': labelledBy };
  }
  if (label) {
    return { 'aria-label': label };
  }
  return {};
}
