<template>
  <div>
    <div style="margin-bottom: 100px;">
      <LoadingList v-if="store?.loading" />
      <empty-data v-else-if="!store.pasiens?.length && !store?.loading" />
      <q-list v-else square separator>
        <q-item v-for="item in store.pasiens" :key="item" v-ripple>
          <q-item-section avatar top>
            <app-avatar-pasien :pasien="item" width="80px" />
          </q-item-section>

          <q-item-section class="q-col-gutter-xs relative-position">
            <div><b>{{ item?.nama }}</b></div>
            <div><b>NIK : {{ item?.nktp }}</b></div>
            <div>Norm | Reg : <span class="text-primary">{{ item?.norm }}</span> | <span class="text-orange">{{
              item.noreg
                }}</span></div>
            <div>Usia : {{ item?.usia }} | <em class="text-grey">{{ item.kelamin }}</em></div>
            <div class="f-10">
              {{ item?.alamat }}
            </div>
            <div class="full-width row justify-between items-center">

              <q-badge outline class="q-mt-sm q-px-sm" dense color="teal">
                <div class="f-12">
                  PASIEN {{ item?.sistem_bayar }}
                </div>
              </q-badge>
              <!-- </div> -->

              <q-badge outline :color="color(item?.flag)">
                {{ label(item?.flag) }}
              </q-badge>
            </div>


          </q-item-section>

          <q-item-section class="q-col-gutter-xs relative-position">
            <div class="text-pink">
              DPJP : <b>{{ item?.dokter ?? '-' }}</b>
            </div>
            <div>
              Tgl Kunjungan : <span class="text-accent">{{ item?.tgl_kunjungan }}</span>
            </div>

          </q-item-section>

          <q-item-section side>
            <q-btn dense outline size="sm" no-caps color="primary" label="LIHAT LAYANAN" class="q-mb-sm"
              icon-right="icon-mat-eye" style="min-width: 120px;" @click="bukaLayananPage(item)" />

            <!-- <q-btn v-else-if="item?.status === '1'" dense size="sm" no-caps color="dark" label="TERIMA PASIEN"
              class="q-mb-sm" icon-right="icon-mat-eye" style="min-width: 120px;" @click="bukaLayananPage(item)" /> -->
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>

  <!-- Layanan -->
  <page-layanan v-model="store.pageLayanan" :pasien="pasien" :loading="store.loadingLayanan" />
</template>
<script setup>
import { usePengunjungHomeCareStore } from 'src/stores/simrs/homeCare/pengunjung'
import { defineAsyncComponent, ref } from 'vue'

const store = usePengunjungHomeCareStore()
const PageLayanan = defineAsyncComponent(() => import('../layanan/PageLayanan.vue'))
const LoadingList = defineAsyncComponent(() => import('./LoadingList.vue'))
const EmptyData = defineAsyncComponent(() => import('./EmptyData.vue'))

const pasien = ref(null)
function label (val) {
  switch (val) {
    case '1':
      return 'Dalam Pelayanan'
      break
    case '2':
      return 'Selesai'
      break

    default:
      return 'Belum Dilayani'
      break
  }
}
function color (val) {
  switch (val) {
    case '1':
      return 'teal'
      break
    case '2':
      return 'green'
      break

    default:
      return 'negative'
      break
  }
}

function bukaLayananPage (item) {
  // console.log('buka layanan', item)
  pasien.value = item
  store.bukaLayanan(true, item)
    .then((val) => {
      pasien.value = val
      store.pasien = val

    })
}
</script>
