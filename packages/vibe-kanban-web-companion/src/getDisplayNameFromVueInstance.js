/**
 * Get display name from a Vue instance
 * @param {any} instance
 * @returns {string | null}
 */
export function getDisplayNameForInstance(instance) {
  if (!instance) return null

  // Vue 3: component type name
  if (instance.type && instance.type.name) {
    return instance.type.name
  }

  // Vue 3: component __name (from script setup)
  if (instance.type && instance.type.__name) {
    return instance.type.__name
  }

  // Vue 2: component options name
  if (instance.$options && instance.$options.name) {
    return instance.$options.name
  }

  // Vue 2: component tag name
  if (instance.$options && instance.$options._componentTag) {
    return instance.$options._componentTag
  }

  // Fallback to constructor name
  if (instance.constructor && instance.constructor.name) {
    return instance.constructor.name
  }

  return 'Anonymous'
}
