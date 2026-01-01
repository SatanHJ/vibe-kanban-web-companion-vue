/**
 * Get source file information from a Vue instance
 * @param {any} instance
 * @returns {{fileName: string, lineNumber: number, columnNumber: number} | null}
 */
export function getSourceForInstance(instance) {
  if (!instance) return null

  // Vue 3: Check for __file property on component type
  if (instance.type && instance.type.__file) {
    return {
      fileName: instance.type.__file,
      lineNumber: 1,
      columnNumber: 1
    }
  }

  // Vue 2: Check for __file in options
  if (instance.$options && instance.$options.__file) {
    return {
      fileName: instance.$options.__file,
      lineNumber: 1,
      columnNumber: 1
    }
  }

  return null
}
