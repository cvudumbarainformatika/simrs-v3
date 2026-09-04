const spo = {
  path: '/spo',
  component: () => import('layouts/V2/IndexLayout.vue'),
  meta: { requireAuth: true },
  children: [
    // Saat buka /spo
    {
      path: '',
      redirect: '/spo/list'
    },

    // List SPO
    {
      path: 'list',
      name: 'spo.list',
      component: () => import('pages/spo/listspo/IndexPage.vue')
    },

    // Form SPO
    {
      path: 'form',
      name: 'spo.form',
      component: () => import('pages/spo/formspo/IndexPage.vue')
    },

// Not Found khusus SPO
    {
      path: 'notfound',
      name: 'spo.notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }
  ]
}
export default spo
