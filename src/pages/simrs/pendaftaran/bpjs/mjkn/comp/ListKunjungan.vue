<template>
  <div>
    <app-loading v-if="loading" />
    <div v-else>
      <div v-if="items?.length <= 0">
        <div
          class="column flex-center"
          style="min-height:50vh"
        >
          <div class="text-h3 q-mb-md">
            🏷️
          </div>
          <div class="f-14">
            Belum Ada Data
          </div>
        </div>
      </div>
      <q-list
        v-else
        separator
      >
        <q-separator
          spaced
          inset
        />

        <q-item
          v-for="(item, i) in items"
          :key="i"
        >
          <q-item-section avatar>
            <app-avatar-pasien
              :pasien="item"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              {{ item.nama? item.nama:'-' }} | <span class="text-primary">{{ item.norm? item.norm:'-' }}</span> | <span class="text-orange">{{ item.nomorantrean? item.nomorantrean:'-' }}</span>
            </q-item-label>
            <q-item-label>
              NOREG : <span class="text-weight-bold">{{ item.noreg?item.noreg:'-' }} </span>
              | Penjamin : <span class="text-weight-bold"> JKN</span>
            </q-item-label>
            <q-item-label>
              DPJP : <span class="text-negative text-weight-bold">{{ item.namadokter?item.namadokter:'-' }}</span> | RUANGAN : <span class="text-teal text-weight-bold"> {{ item.namapoli?item.namapoli:'-' }}</span>
            </q-item-label>
            <q-item-label caption>
              USIA : <span class="text-weight-bold">{{ item.usia }}</span>  | Kelamin : <span class="text-weight-bold">{{ item.kelamin?item.kelamin:'-' }}</span>
            </q-item-label>
            <!-- <q-item-label>
              Penjamin : <span class="text-weight-bold"> {{ item.sistembayar }}</span>
            </q-item-label> -->
            <!-- <q-item-label
              caption
            >
              Status Pasien: <span class="text-negative text-weight-bold">{{ getStatus(item.taskid) }}</span>
            </q-item-label> -->
          </q-item-section>

          <!-- <q-item-section
            side
          >
            {{ item.nomorkartu }}
            <figure
              class="qrcode full-width q-pa-sm"
            >
              <vue-qrcode
                :value="item.nomorkartu"
                tag="svg"
                :options="{
                  errorCorrectionLevel: 'Q',
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },
                  margin:2
                }"
              />
            </figure>
          </q-item-section> -->

          <q-item-section
            side
            top
          >
            <q-item-label caption>
              <div class="row justify-end">
                <div class="q-ml-sm">
                  <q-badge
                    outline
                    :color="item.seprajal?'teal':'negative'"
                    :label="item.seprajal?item.seprajal:'SEP Belum terbit'"
                  />
                </div>
              </div>
              <div class="row justify-end q-mt-sm">
                <div class="q-ml-sm">
                  <q-badge
                    outline
                    :color="item.checkin?'teal':'negative'"
                    :label="item.checkin?'Sudah Check-in':'Belum Check-in'"
                  />
                </div>
              </div>
              <div class="row justify-end q-mt-sm">
                <div
                  v-if="!(loadingSend && (item.norm ? rm === item.norm:false))"
                  class="q-ml-sm"
                  :class="item.noreg?'':'cursor-pointer'"
                  @click="emits('kirimPoli', item)"
                >
                  <!-- @click="kirimPoli(item)" -->
                  <q-badge
                    outline
                    :color="item.noreg?'teal':'negative'"
                    :label="item.noreg?'Sudah di poli':'Daftarkan Pasien'"
                  />
                </div>
                <div
                  v-if="loadingSend && (item.norm ? (item.norm !== '-' ? rm === item.norm : rm===item.nomorkartu):false)"
                  class="q-ml-sm"
                >
                  <q-btn
                    loading
                    outline
                    size="sm"
                    :color="item.noreg?'teal':'negative'"
                    :label="item.noreg?'Sudah di poli':'Daftarkan Pasien'"
                  />
                </div>
              </div>
              <div class="row q-mt-sm text-end">
                <div class="q-ml-sm">
                  <q-btn
                    size="sm"
                    color="teal"
                    no-caps
                    label="Cetak Antrian"
                    @click="emits('cetakAntrian',item)"
                  />
                </div>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator
          spaced
          inset
        />
      </q-list>
    </div>
  </div>
</template>

<script setup>

defineProps({
  rm: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  loadingSend: { type: Boolean, default: false },
  items: { type: Array, default: () => [] }
})
const emits = defineEmits(['kirimPoli', 'cetakAntrian'])
// krirm ke poli
// function kirimPoli(val) {
//   console.log('kirim poli ', val)
//   emits('kirimPoli', val)
// }

// function getStatus(arr) {
//   if (arr?.length === 0) {
//     return '-'
//   }

//   // 1 (mulai waktu tunggu admisi),
//   // 2 (akhir waktu tunggu admisi/mulai waktu layan admisi),
//   // 3 (akhir waktu layan admisi/mulai waktu tunggu poli),
//   // 4 (akhir waktu tunggu poli/mulai waktu layan poli),
//   // 5 (akhir waktu layan poli/mulai waktu tunggu farmasi),
//   // 6 (akhir waktu tunggu farmasi/mulai waktu layan farmasi membuat obat),
//   // 7 (akhir waktu obat selesai dibuat),
//   // 99 (tidak hadir/batal)
//   const arr0 = arr[0].taskid
//   let text
//   switch (arr0) {
//     case '1' || 1:
//       text = 'Menunggu di Admisi'
//       break
//     case '2' || 2:
//       text = 'Pelayanan di Admisi'
//       break
//     case '3' || 3:
//       text = 'Menunggu di Poli'
//       break
//     case '4' || 4:
//       text = 'Pelayanan di Poli'
//       break
//     case '5' || 5:
//       text = 'Menunggu di Farmasi'
//       break
//     case '6' || 6:
//       text = 'Farmasi'
//       break
//     case '7' || 7:
//       text = 'Sudah Ambil Obat di Farmasi'
//       break
//     default:
//       text = 'Tidak Hadir/ Batal'
//   }
//   return text
// }
</script>
<style scoped>
.qrcode {
  display: inline-block;
  font-size: 0;
  margin: 0;
  position: relative;
}

</style>
