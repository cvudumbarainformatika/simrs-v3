const radiologi = {
  path: '/radiologi',
  component: () => import('layouts/V2/IndexLayout.vue'),
  meta: { requireAuth: true },
  children: [
    { path: '', redirect: '/radiologi/pengunjung' },
    {
      path: '/radiologi/dashboard',
      name: 'radiologi.dashboard',
      component: () => import('pages/simrs/radiologi/dashboard/IndexPage.vue')
    },
    {
      path: '/radiologi/pengunjung',
      name: 'radiologi.pengunjung',
      component: () => import('pages/simrs/radiologi/pengunjung/IndexPage.vue')
    },
    {
      path: '/radiologi/permintaan-luar',
      name: 'radiologi.permintaan-luar',
      component: () => import('pages/simrs/radiologi/luar/IndexPage.vue')
    },
    {
      path: '/radiologi/laporan',
      name: 'radiologi.laporan',
      component: () => import('pages/simrs/radiologi/laporan/IndexPage.vue')
    },

    {
      path: '/radiologi/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default radiologi
