// vite

import { defineBoot } from '@quasar/app-vite/wrappers'
import _ from 'lodash'

// Remove eager loading
const globalComponents = import.meta.glob('components/~global/*.vue')
const startIndex = '/~global/'.length

export default defineBoot(({ app }) => {
  const componentPromises = Object.keys(globalComponents).map(async (key) => {
    const component = await globalComponents[key]()
    const componentName = _.upperFirst(
      _.camelCase(key.split('/').pop().replace(/\.\w+$/, ''))
    )

    // Register component
    app.component(componentName, component.default)
  })

  // Wait for all components to be registered
  return Promise.all(componentPromises)
})
