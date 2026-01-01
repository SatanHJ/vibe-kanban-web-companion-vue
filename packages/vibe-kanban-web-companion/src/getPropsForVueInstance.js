/**
 * Get props from a Vue instance
 * @param {any} instance
 * @returns {Object}
 */
export function getPropsForInstance(instance) {
  if (!instance) return {}

  // Vue 3: props are stored in instance.props
  if (instance.props) {
    return { ...instance.props }
  }

  // Vue 2: props are stored in instance.$props
  if (instance.$props) {
    return { ...instance.$props }
  }

  return {}
}
