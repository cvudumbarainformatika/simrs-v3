const farmasi = {
  path: '/farmasi',
  component: () => import('layouts/V2/IndexLayout.vue'),
  meta: { requireAuth: true },
  children: [
    { path: '', name: 'farmasi', redirect: '/farmasi/dashboard' },
    {
      path: '/farmasi/dashboard',
      name: 'farmasi.dashboard',
      component: () => import('pages/simrs/farmasi/IndexPage.vue')
    },
    {
      path: '/farmasi/stok',
      name: 'farmasi.stok',
      component: () => import('pages/simrs/farmasi/stok/IndexPage.vue')
    },
    {
      path: '/farmasi/stoksekarang',
      name: 'farmasi.stoksekarang',
      component: () => import('pages/simrs/farmasi/stoksekarang/IndexPage.vue')
    },
    {
      path: '/farmasi/verif-rencana-pesanan',
      name: 'farmasi.verif-rencana-pesanan',
      component: () => import('pages/simrs/farmasi/verifrencanapemesanan/IndexPage.vue')
    },
    {
      path: '/farmasi/pembayaran',
      component: () => import('pages/simrs/farmasi/pembayaran/IndexPage.vue')
    },
    {
      path: '/farmasi/penyesuaian',
      component: () => import('pages/simrs/farmasi/penyesuaian/IndexPage.vue')
    },
    {
      path: '/farmasi/perbaikandata',
      component: () => import('pages/simrs/farmasi/perbaikandata/IndexPage.vue')
    },
    {
      path: '/farmasi/perbaikanharga',
      component: () => import('pages/simrs/farmasi/perbaikanharga/IndexPage.vue')
    },
    {
      path: '/farmasi/restriksi-fornas',
      component: () => import('pages/simrs/farmasi/restriksiFornas/IndexPage.vue')
    },
    {
      path: '/farmasi/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default farmasi
