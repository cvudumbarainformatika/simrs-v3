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
      name: 'siasik.ls.kontrak',
      component: () => import('pages/siasik/transaksi/ls/kontrak/IndexPage.vue'),
      children: [
        { path: '', name: 'kontrak', redirect: '/siasik/ls/kontrak/form' },
        {
          path: '/siasik/ls/kontrak/form',
          name: 'siasik.ls.kontrak.form',
          component: () =>
            import('src/pages/siasik/transaksi/ls/kontrak/formkontrak/IndexPage.vue')
        },
        {
          path: '/siasik/ls/kontrak/list',
          name: 'siasik.ls.kontrak.list',
          component: () =>
            import('src/pages/siasik/transaksi/ls/kontrak/listkontrak/IndexPage.vue')
        },


      ]
    },
    {
      path: '/siasik/ls/serahterima',
      name: 'siasik.ls.serahterima',
      component: () => import('pages/siasik/transaksi/ls/serahterima/IndexPage.vue'),
      children: [
        { path: '', name: 'serahterima', redirect: '/siasik/ls/serahterima/formserahterima' },
        {
          path: '/siasik/ls/serahterima/formserahterima',
          name: 'siasik.ls.serahterima.formserahterima',
          component: () =>
            import('src/pages/siasik/transaksi/ls/serahterima/FormInput/IndexPage.vue')
        },
        {
          path: '/siasik/ls/serahterima/listserahterima',
          name: 'siasik.ls.serahterima.listserahterima',
          component: () =>
            import('src/pages/siasik/transaksi/ls/serahterima/ListData/IndexPage.vue')
        },

      ]
    },
    {
      path: '/siasik/ls/npdls',
      name: 'siasik.ls.npdls',
      component: () => import('pages/siasik/transaksi/ls/npdls/IndexPage.vue'),
      children: [
        { path: '', name: 'npdls', redirect: '/siasik/ls/npdls/newformnpd' },
        {
          path: '/siasik/ls/npdls/newformnpd',
          name: 'siasik.ls.npdls.newformnpd',
          component: () =>
            import('src/pages/siasik/transaksi/ls/npdls/NewFormnpdls/IndexPage.vue')
        },
        {
          path: '/siasik/ls/npdls/newlistnpd',
          name: 'siasik.ls.npdls.newlistnpd',
          component: () =>
            import('src/pages/siasik/transaksi/ls/npdls/ListDataNpdls/IndexPage.vue')
        },

      ]
    },
    {
      path: '/siasik/ls/notadinas',
      name: 'siasik.ls.notadinas',
      component: () => import('pages/siasik/transaksi/ls/notadinas/IndexPage.vue'),
      children: [
        { path: '', name: 'notadinas', redirect: '/siasik/ls/notadinas/formdata' },
        {
          path: '/siasik/ls/notadinas/formdata',
          name: 'siasik.ls.notadinas.formdata',
          component: () =>
            import('src/pages/siasik/transaksi/ls/notadinas/formdata/IndexPage.vue')
        },
        {
          path: '/siasik/ls/notadinas/listdata',
          name: 'siasik.ls.notadinas.listdata',
          component: () =>
            import('src/pages/siasik/transaksi/ls/notadinas/listdata/IndexPage.vue')
        },

      ]
    },
    {
      path: '/siasik/ls/verifnotadinas',
      name: 'siasik.ls.verifnotadinas',
      component: () => import('pages/siasik/transaksi/ls/verifnotadinas/IndexPage.vue')
    },
    {
      path: '/siasik/ls/npkls',
      name: 'siasik.ls.npkls',
      component: () => import('pages/siasik/transaksi/ls/npkls/IndexPage.vue'),
      children: [
        { path: '', name: 'npkls', redirect: '/siasik/ls/npkls/formdata' },
        {
          path: '/siasik/ls/npkls/formdata',
          name: 'siasik.ls.npkls.formdata',
          component: () =>
            import('src/pages/siasik/transaksi/ls/npkls/formdata/IndexPage.vue')
        },
        {
          path: '/siasik/ls/npkls/listdata',
          name: 'siasik.ls.npkls.listdata',
          component: () =>
            import('src/pages/siasik/transaksi/ls/npkls/listdata/IndexPage.vue')
        },

      ]
    },
    {
      path: '/siasik/ls/pencairanls',
      name: 'siasik.ls.pencairanls',
      component: () => import('pages/siasik/transaksi/ls/pencairanls/IndexPage.vue')
    },
    {
      path: '/siasik/panjar/up',
      name: 'siasik.panjar.up',
      component: () => import('pages/siasik/transaksi/panjar/npd_up/IndexPage.vue'),
      children: [
        { path: '', name: 'up', redirect: '/siasik/panjar/up/formdata' },
        {
          path: '/siasik/panjar/up/formdata',
          name: 'siasik.panjar.up.formdata',
          component: () =>
            import('src/pages/siasik/transaksi/panjar/npd_up/form/IndexPage.vue')
        },
        {
          path: '/siasik/panjar/up/listdata',
          name: 'siasik.panjar.up.listdata',
          component: () =>
            import('src/pages/siasik/transaksi/panjar/npd_up/listdata/IndexPage.vue')
        },


      ]
    },
    {
      path: '/siasik/panjar/verifup',
      name: 'siasik.panjar.verifup',
      component: () => import('pages/siasik/transaksi/panjar/verif_npd_up/IndexPage.vue'),
      children: [
        { path: '', name: 'verif_up', redirect: '/siasik/panjar/verifup/listbelum' },
        {
          path: '/siasik/panjar/verifup/listbelum',
          name: 'siasik.panjar.verifup.listbelum',
          component: () =>
            import('src/pages/siasik/transaksi/panjar/verif_npd_up/listdata/IndexPage.vue')
        },
        {
          path: '/siasik/panjar/verifup/listsudah',
          name: 'siasik.panjar.verifup.listsudah',
          component: () =>
            import('src/pages/siasik/transaksi/panjar/verif_npd_up/listdata_verif/IndexPage.vue')
        },


      ]
    },
    // {
    //   path: '/siasik/rencanabelanja',
    //   name: 'siasik.rencanabelanja',
    //   component: () => import('pages/siasik/transaksi/rencanaBelanja/IndexPage.vue'),
    //   children: [
    //     { path: '', name: 'rencana', redirect: '/siasik/rencanabelanja/formdata' },
    //     {
    //       path: '/siasik/rencanabelanja/formdata',
    //       name: 'siasik.rencanabelanja.formdata',
    //       component: () =>
    //         import('src/pages/siasik/transaksi/rencanaBelanja/FormData/IndexPage.vue')
    //     },
    //     {
    //       path: '/siasik/rencanabelanja/listdata',
    //       name: 'siasik.rencanabelanja.listdata',
    //       component: () =>
    //         import('src/pages/siasik/transaksi/rencanaBelanja/ListData/IndexPage.vue')
    //     },

    //   ]
    // },

    {
      path: '/siasik/notfound',
      component: () => import('pages/MidlewareNotFound.vue')
    }

  ]
}
export default siasik
