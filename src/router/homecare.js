const homecare = {
  path: '/homecare',
  component: () => import('layouts/V2/IndexLayout.vue'),
  meta: { requireAuth: true },
  children: [
    { path: '', redirect: '/homecare/list-pasien' },
    {
      path: '/homecare/list-pasien',
      name: 'homecare.list-pasien',
      component: () => import('pages/simrs/homeCare/pengunjung/IndexPage.vue')
    },
    // {
    //   path: '/homecare/suratkontrol',
    //   name: 'homecare.suratkontrol',
    //   component: () => import('pages/simrs/homecare/suratkontrol/IndexPage.vue')
    // },

    {
      path: '/homecare/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default homecare
