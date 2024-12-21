// vite

import _ from 'lodash'

// const globalComponents = import.meta.glob('components/~global/*.vue')
const globalComponents = import.meta.glob('components/~global/*.vue', { eager: true })

export default async ({ app }) => {
  Object.entries(globalComponents).forEach(([path, m]) => {
    // console.log('ooooi', path);
    
    const componentName = _.upperFirst(
      _.camelCase(path.split('/').pop().replace(/\.\w+$/, ''))
    )

    // console.log('componentName', componentName);
    
    app.component(`${componentName}`, m['default'])
  })
}
