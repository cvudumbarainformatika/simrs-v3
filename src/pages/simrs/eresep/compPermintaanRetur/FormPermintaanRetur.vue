<template>
  <div class="bg-white full-height column">
    <div class="col-auto bg-primary text-white">
      <div class="q-pa-sm row items-center justify-between">
        <div class="f-12">
          Form Permintaan Retur
        </div>
      </div>
    </div>

    <div class="col full-height relative-position">
      <div class="row justify-between items-center q-px-xs q-py-xs">
        <div class="col-6">
          <app-input-simrs v-model="cari" label="Retur" class="q-mt-sm" @update:model-value="search" />
        </div>
        <div class="col-6 text-right">
          <app-btn v-if="store.form?.length" label="kirim depo" @click="store.simpanPermintaan()" />
        </div>
      </div>
      <template v-if="store.items?.length">
        <!-- <div class="row justify-between items-center q-px-xs q-py-xs">

        </div> -->
        <q-list separator bordered>
          <q-item class="q-pa-none">
            <q-item-section>
              <div class="row q-px-md q-py-xs bg-dark text-white text-bold q-col-gutter-x-xs">
                <div class="col-2">
                  Ruangan
                </div>
                <div class="col-3">
                  No Resep
                </div>
                <div class="col-4">
                  Nama Obat
                </div>
                <div class="col-1">
                  Satuan
                </div>
                <div class="col-1 text-center">
                  Jml
                </div>
                <div class="col-1 text-center">
                  Ret
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
      <q-scroll-area style="height: 100%; padding-bottom: 100px;">
        <q-list separator bordered>
          <template v-if="store.items?.length">
            <!-- <q-item class="q-pa-none">
              <q-item-section>
                <div class="row q-px-md q-py-xs bg-dark text-white text-bold q-col-gutter-x-xs">
                  <div class="col-2">
                    Ruangan
                  </div>
                  <div class="col-3">
                    No Resep
                  </div>
                  <div class="col-4">
                    Nama Obat
                  </div>
                  <div class="col-1">
                    Satuan
                  </div>
                  <div class="col-1 text-center">
                    Jml
                  </div>
                  <div class="col-1 text-right">
                    Ret
                  </div>
                </div>
              </q-item-section>
            </q-item> -->

            <template v-for="(rinci) in store.items" :key="rinci">
              <q-item class="q-pa-none">
                <q-item-section>
                  <div class="row q-px-md q-py-xs q-col-gutter-x-xs items-center">
                    <div class="col-2">
                      {{ rinci?.ruanganranap?.rs2 ?? rinci?.poli?.rs2 }}
                    </div>
                    <div class="col-3">
                      {{ rinci?.noresep }}
                    </div>
                    <div class="col-4">
                      <span v-html="highlightText(rinci?.mobat?.nama_obat)" />
                      <!-- {{ rinci?.mobat?.nama_obat }} -->
                    </div>
                    <div class="col-1">
                      {{ rinci?.mobat?.satuan_k }}
                    </div>
                    <div class="col-1 text-center">
                      {{ rinci?.jumlah }}
                    </div>
                    <div class="col-1 text-center">
                      <app-input-simrs v-model="rinci.retur" label="Retur" class="q-mt-sm"
                        @update:model-value="setRetur($event, rinci)" :autofocus="false" />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </template>

          </template>
          <template v-else>
            <div class="row items-center justify-center q-pa-md text-bold">
              Tidak ada data obat

            </div>
          </template>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup>
import { notifErrVue } from 'src/modules/utils'
import { usePermintaanReturEresepStore } from 'src/stores/simrs/farmasi/permintaanresep/permintaanretur'
import { ref } from 'vue'

const props = defineProps({
  pasien: { type: Object, default: null },
  depo: { type: String, default: '' },
})
const store = usePermintaanReturEresepStore()
const cari = ref('')
function setRetur (val, rinci) {
  const nilai = parseInt(val)
  if (nilai > parseInt(rinci.jumlah)) {
    rinci.retur = rinci.jumlah
    notifErrVue('Retur tidak boleh melebihi jumlah obat')
  }
  // console.log('retur', val, rinci)

  store.setForm()
}
function search (val) {
  store.items = store.allItems.filter(item => item?.mobat?.nama_obat?.toLowerCase().includes(val.toLowerCase()))
  // console.log('cari', store.items)

}
function highlightText (text) {
  return text?.replace(new RegExp(cari.value, 'ig'), matchedText => `<span class="bg-yellow text-dark">${matchedText}</span>`)
}
</script>
