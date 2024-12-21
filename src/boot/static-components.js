// vite

import _ from 'lodash';

const globalComponents = import.meta.glob('components/~static/*.vue', { eager: true });

// const globalComponents = async () => {
//   const filename = "message";
//   // console.log(import.meta.globEager('components/~static/*.vue'));
//   console.log('ooooi', filename);
//   console.log('await ',await global);
  
//   return await import.meta.globEager('components/~static/*.vue');
// };

export default async ({ app }) => {
  // globalComponents();
  Object.entries(globalComponents).forEach(([path, m]) => {
    const componentName = _.upperFirst(
      _.camelCase(path.split('/')?.pop()?.replace(/\.\w+$/, ''))
    );
    app?.component(
      `${componentName}`, m['default']
    );
  })
}
