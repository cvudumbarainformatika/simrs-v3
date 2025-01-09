const siasik = {
  path: '/siasik',
  component: () => import('layouts/V2/IndexLayout.vue'),
  meta: { requireAuth: true },
  children: [
    { path: '', name: 'siasik', redirect: '/siasik/saldo/saldoawal' },
    {
      path: '/siasik/saldo/saldoawal',
      // name: 'siasik.saldo',
      component: () => import('pages/siasik/transaksi/saldo/saldoawal/IndexPage.vue')
    },
    {
      path: '/siasik/saldo/silpa',
      // name: 'siasik.saldo',
      component: () => import('pages/siasik/transaksi/saldo/pembiayaan/IndexPage.vue')
    },
    {
      path: '/siasik/ls/kontrak',
      // name: 'siasik.saldo',
      component: () => import('pages/siasik/transaksi/ls/kontrak/IndexPage.vue')
    },
    {
      path: '/siasik/ls/serahterima',
      // name: 'siasik.saldo',
      component: () => import('pages/siasik/transaksi/ls/serahterima/IndexPage.vue')
    },
    {
      path: '/siasik/ls/npdls',
      name: 'siasik.ls.npdls',
      component: () => import('pages/siasik/transaksi/ls/npdls/IndexPage.vue'),
      children: [
        { path: '', name: 'npdls', redirect: '/siasik/ls/npdls/formnpd' },
        {
          path: '/siasik/ls/npdls/formnpd',
          name: 'siasik.ls.npdls.formnpd',
          component: () =>
            import('src/pages/siasik/transaksi/ls/npdls/FormNpdls/IndexPage.vue')
        },
        {
          path: '/siasik/ls/npdls/listnpd',
          name: 'siasik.ls.npdls.listnpd',
          component: () =>
            import('src/pages/siasik/transaksi/ls/npdls/ListDataNpdls/IndexPage.vue')
        },

      ]
    },
    // {
    //   path: '/satset/kunjungan',
    //   name: 'satset.kunjungan',
    //   component: () => import('pages/satset/kunjungan/IndexPage.vue')
    // },

    {
      path: '/siasik/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default siasik
