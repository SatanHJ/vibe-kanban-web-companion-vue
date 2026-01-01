import { getVueInstanceForElement } from './getVueInstanceForElement.js'

/**
 * Get all Vue instances for an element and its ancestors
 * @param {HTMLElement} element
 * @returns {Array}
 */
export function getVueInstancesForElement(element) {
  const instances = []
  let current = element

  while (current && current !== document.body) {
    const instance = getVueInstanceForElement(current)
    if (instance) {
      instances.push(instance)
    }
    current = current.parentElement
  }

  return instances
}
