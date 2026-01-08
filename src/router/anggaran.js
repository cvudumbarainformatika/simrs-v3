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
        },
        {
          path: '/anggaran/penyusunan/pengusulan',
          name: 'anggaran.penyusunan.pengusulan',
          component: () => import('pages/siasik/anggaran/penyusunan/pengusulan/IndexPage.vue'),
          children: [
            { path: '', name: 'pengusulan', redirect: '/anggaran/penyusunan/pengusulan/form' },
            {
              path: '/anggaran/penyusunan/pengusulan/form',
              name: 'anggaran.penyusunan.pengusulan.form',
              component: () =>
                import('src/pages/siasik/anggaran/penyusunan/pengusulan/FormData/IndexPage.vue')
            },
            {
              path: '/anggaran/penyusunan/pengusulan/listdata',
              name: 'anggaran.penyusunan.pengusulan.listdata',
              component: () =>
                import('src/pages/siasik/anggaran/penyusunan/pengusulan/ListData/IndexPage.vue')
            },

          ]
        },
        {
          path: '/anggaran/penyusunan/prioritas',
          name: 'anggaran.penyusunan.prioritas',
          component: () => import('pages/siasik/anggaran/penyusunan/penyesuaian_prioritas/IndexPage.vue'),
          children: [
            { path: '', name: 'prioritas', redirect: '/anggaran/penyusunan/prioritas/form' },
            {
              path: '/anggaran/penyusunan/prioritas/form',
              name: 'anggaran.penyusunan.prioritas.form',
              component: () =>
                import('src/pages/siasik/anggaran/penyusunan/penyesuaian_prioritas/FormData/IndexPage.vue')
            },
            {
              path: '/anggaran/penyusunan/prioritas/listdata',
              name: 'anggaran.penyusunan.prioritas.listdata',
              component: () =>
                import('src/pages/siasik/anggaran/penyusunan/penyesuaian_prioritas/ListData/IndexPage.vue')
            },

          ]
        },
      ]
    },

    {
      path: '/anggaran/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default anggaran
