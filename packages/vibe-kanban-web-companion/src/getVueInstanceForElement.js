/**
 * @param {HTMLElement} element
 */
export function getVueInstanceForElement(element) {
  // Vue 3: Try to get the Vue instance from the element
  if ('__vueParentComponent' in element) {
    return element.__vueParentComponent
  }

  // Vue 3: Alternative property
  if ('__vnode' in element) {
    return element.__vnode
  }

  // Vue 2: Check for Vue instance
  if ('__vue__' in element) {
    return element.__vue__
  }

  // Search for Vue instance in element properties
  for (const key in element) {
    if (key.startsWith('__vue')) {
      return element[key]
    }
  }

  return null
}
