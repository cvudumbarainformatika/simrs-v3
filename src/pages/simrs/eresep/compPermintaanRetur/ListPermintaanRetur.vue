<template>
  <div class="bg-white full-height">
    <div class="row bg-teal text-white">
      <q-bar class=" col-12 bg-teal text-white">
        <div class="q-py-sm f-14 ">
          List Permintaan Retur
        </div>
        <q-space />
        <div class="q-py-xs">
          <!-- <q-select v-model="store.noresep" outlined standout="bg-yellow-3" bg-color="white" dense
            :options="store.noreseps"
            :display-value="`${store.noresep === null || store.noresep === '' || store.noresep === 'BARU' ? 'BARU' : store.noresep}`"
            style="min-width: 200px;" @update:model-value="store.setResep" /> -->
        </div>
      </q-bar>
    </div>

    <div class="full-height relative-position column">
      <div v-if="store.form?.length" class="col">
        <div class="row bg-yellow text-red">
          Form Sementara Permintaan Retur (Belum dikirim ke depo)
        </div>
        <q-list separator bordered>
          <q-item class="q-pa-none">
            <q-item-section>
              <div class="row q-px-md q-py-xs bg-dark text-white text-bold q-col-gutter-x-xs">
                <div class="col-4">
                  No Resep
                </div>
                <div class="col-5">
                  Nama Obat
                </div>
                <div class="col-1">
                  Satuan
                </div>
                <div class="col-1 text-right">
                  Jml
                </div>
                <div class="col-1 text-right">
                  Ret
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <q-scroll-area style="height: 100%; width: 100%; min-width: 100px; min-height: 300px; padding-bottom: 60px;">
          <q-list separator bordered>
            <template v-if="store.form?.length">
              <!-- <q-item class="q-pa-none">
                <q-item-section>
                  <div class="row q-px-md q-py-xs bg-dark text-white text-bold q-col-gutter-x-xs">
                    <div class="col-4">
                      No Resep
                    </div>
                    <div class="col-5">
                      Nama Obat
                    </div>
                    <div class="col-1">
                      Satuan
                    </div>
                    <div class="col-1 text-right">
                      Jml
                    </div>
                    <div class="col-1 text-right">
                      Ret
                    </div>
                  </div>
                </q-item-section>
              </q-item> -->
              <template v-for="(rinci) in store.form" :key="rinci">
                <q-item class="q-pa-none">
                  <q-item-section>
                    <div class="row q-px-md q-py-xs q-col-gutter-x-xs items-center">
                      <div class="col-4">
                        {{ rinci?.noresep }}
                      </div>
                      <div class="col-5">
                        {{ rinci?.mobat?.nama_obat }}
                      </div>
                      <div class="col-1">
                        {{ rinci?.mobat?.satuan_k }}
                      </div>
                      <div class="col-1 text-right">
                        {{ rinci?.jumlah }}
                      </div>
                      <div class="col-1 text-right">
                        {{ rinci?.retur }}
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
            </template>
          </q-list>
        </q-scroll-area>
      </div>
      <div v-if="store.listItems?.length && !store.form?.length" class="col">
        <q-scroll-area style="height: 100%; width: 100%; min-width: 100px; min-height: 300px; padding-bottom: 60px;">
          <q-list separator bordered>
            <template v-if="store.listItems?.length">
              <template v-for="(item) in store.listItems" :key="item">
                <q-item class="q-pa-none">
                  <q-item-section>
                    <div class="row q-px-md q-py-xs q-col-gutter-x-xs items-center">
                      <div class="col-4">
                        {{ item?.nopermintaan }}
                      </div>
                      <div class="col-5">
                        {{ depo(item?.rinci) }}
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item class="q-pa-none q-ml-md">
                  <q-item-section>
                    <div class="row q-px-md q-py-xs bg-dark text-white text-bold q-col-gutter-x-xs">
                      <div class="col-4">
                        No Resep
                      </div>
                      <div class="col-4">
                        Nama Obat
                      </div>
                      <div class="col-2">
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
                <template v-for="(rinci) in item?.rinci" :key="rinci">
                  <q-item class="q-pa-none q-ml-md">
                    <q-item-section>
                      <div class="row q-px-md q-py-xs q-col-gutter-x-xs items-center">
                        <div class="col-4">
                          {{ rinci?.noresep }}
                        </div>
                        <div class="col-4">
                          {{ rinci?.mobat?.nama_obat }}
                        </div>
                        <div class="col-2">
                          {{ rinci?.mobat?.satuan_k }}
                        </div>
                        <div class="col-1 text-center">
                          {{ rinci?.jumlah }}
                        </div>
                        <div class="col-1 text-center">
                          {{ rinci?.retur }}
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </template>
              </template>
            </template>
          </q-list>
        </q-scroll-area>
      </div>
    </div>

  </div>
</template>
<script setup>
import { usePermintaanReturEresepStore } from 'src/stores/simrs/farmasi/permintaanresep/permintaanretur'

const props = defineProps({
  pasien: { type: Object, default: null },
  depo: { type: String, default: '' },
})

const store = usePermintaanReturEresepStore()
function depo (val) {
  console.log('depo', val)
  const depos = [... new Set(val.map(a => a.depo))]
  const depo = store.depos.filter(a => depos.includes(a.value))
  const nama = depo.map(a => a.nama).join(', ')
  return nama
}
</script>
