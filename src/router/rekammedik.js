const ranap = {
  path: '/rekammedik',
  component: () => import('layouts/V2/IndexLayout.vue'),
  meta: { requireAuth: true },
  children: [
    { path: '', redirect: '/rekammedik/mapping' },
    {
      path: '/rekammedik/mapping',
      name: 'rekammedik.mapping',
      component: () => import('pages/simrs/rekammedik/mapping/IndexPage.vue')
    },
    {
      path: '/rekammedik/ranap',
      name: 'rekammedik.ranap',
      component: () => import('pages/simrs/mpp/ranap/IndexPage.vue')
    },
    {
      path: '/rekammedik/rajal',
      name: 'rekammedik.rajal',
      component: () => import('pages/simrs/mpp/rajal/IndexPage.vue')
    },
    {
      path: '/rekammedik/gawat-darurat',
      name: 'rekammedik.gawat-darurat',
      component: () => import('pages/simrs/mpp/igd/IndexPage.vue')
    },
    // {
    //   path: '/ranap/suratkontrol',
    //   name: 'ranap.suratkontrol',
    //   component: () => import('pages/simrs/ranap/suratkontrol/IndexPage.vue')
    // },

    {
      path: '/ranap/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default ranap
