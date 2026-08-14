const ranap = {
  path: '/ranap',
  component: () => import('layouts/V2/IndexLayout.vue'),
  meta: { requireAuth: true },
  children: [
    { path: '', redirect: '/ranap/pengunjung' },
    {
      path: '/ranap/pengunjung',
      name: 'ranap.pengunjung',
      component: () => import('pages/simrs/ranap/pengunjung/IndexPage.vue')
    },
    {
      path: '/ranap/dashboard',
      name: 'ranap.dashboard',
      component: () => import('pages/simrs/ranap/dashboard/IndexPage.vue')
    },
    {
      path: '/ranap/listupdatepulangbpjs',
      name: 'ranap.listupdatepulangbpjs',
      component: () => import('pages/simrs/ranap/listupdatepulangbpjs/IndexPage.vue')
    },

    {
      path: '/ranap/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default ranap
