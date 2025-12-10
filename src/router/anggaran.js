const anggaran = {
  path: '/anggaran',
  component: () => import('layouts/V2/IndexLayout.vue'),
  meta: { requireAuth: true },
  children: [
    { path: '', name: 'anggaran', redirect: '/anggaran/penyusunan' },

    {
      path: '/anggaran/penyusunan',
      // name: 'laporan.rekap.datapasien',
      component: () => import('pages/siasik/anggaran/penyusunan/IndexPage.vue'),
      children: [
        { path: '', redirect: '/anggaran/penyusunan/anggaranpendapatan' },
        {
          path: '/anggaran/penyusunan/anggaranpendapatan',
          name: 'anggaran.penyusunan.anggaranpendapatan',
          component: () =>
            import('src/pages/siasik/anggaran/penyusunan/anggaranpendapatan/IndexPage.vue')
        },
        {
          path: '/anggaran/penyusunan/penetapanpagu',
          name: 'anggaran.penyusunan.penetapanpagu',
          component: () =>
            import('src/pages/siasik/anggaran/penyusunan/penetapanpagu_kegiatan/IndexPage.vue')
        }
      ]
    },

    {
      path: '/anggaran/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default anggaran
