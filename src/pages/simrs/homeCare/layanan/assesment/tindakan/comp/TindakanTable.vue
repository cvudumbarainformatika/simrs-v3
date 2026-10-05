<template>
  <q-card flat square bordered class="column full-height">
    <div class="col-auto">
      <q-bar class="bg-teal text-white q-pa-sm" style="min-height: 45px;">
        <div class="f-12 text-weight-bold">
          Riwayat Tindakan
        </div>
        <q-space />
        <div class="q-py-xs">
          <q-select
            v-model="store.notaTindakan"
            outlined
            standout="bg-yellow-3"
            bg-color="white"
            dense
            :options="store.notaTindakans"
            :display-value="`NOTA: ${store.notaTindakan === '' || store.notaTindakan === 'BARU' ? 'BARU' : store.notaTindakan}`"
            style="min-width: 200px;"
          />
        </div>
      </q-bar>
    </div>
    <div class="col-grow">
      <div class="full-height bg-grey-2">
        <q-scroll-area v-if="filterredTable?.length" style="height:calc(100% - 1px)">
          <div class="fit q-pa-sm scroll">
            <transition-group name="list">
              <q-card flat bordered class="q-mb-xs bg-white" v-for="(item, i) in filterredTable" :key="item?.id || i">
                <q-item class="list-move">
                  <q-item-section>
                    <q-item-label lines="2" class="f-12">
                      <span class="">Nota</span> : <span class="text-weight-bold text-accent">{{ item?.rs2 }} </span>
                    </q-item-label>
                    <q-item-label lines="2" class="f-12">
                      <span class="">Tindakan x Jml</span> : <span class="text-weight-bold">{{ item.mastertindakan?.rs2 || item?.mastertindakan?.tindakan }} </span> x <span class="text-weight-bold text-negative">{{ item.rs5 ? item.rs5 : 0 }}</span>
                    </q-item-label>

                    <q-item-label lines="2" class="f-12">
                      <em class="text-accent">{{ dateFullFormat(item.rs3) }} </em>
                    </q-item-label>
                    <q-item-label lines="3" class="f-10 text-italic" v-if="item?.rs20">
                      <span class="">Keterangan</span> : <span class="">{{ item?.rs20 }} </span>
                    </q-item-label>
                    <q-item-label lines="2" class="f-12 text-italic text-accent">
                      <span class="">oleh</span> : <b>Pel1 </b>
                      (<span v-for="(pel, x) in setPelaksana(item)?.pelaksanaSatu" :key="x" class="">{{ namaPetugas(pel) }}<span v-if="x < setPelaksana(item)?.pelaksanaSatu.length - 1">, </span></span>)
                      <template v-if="setPelaksana(item)?.pelaksanaDua?.length">
                        <span class=""> / </span> <b>Pel2 </b>
                        (<span v-for="(pel, y) in setPelaksana(item)?.pelaksanaDua" :key="y" class="">{{ namaPetugas(pel) }}<span v-if="y < setPelaksana(item)?.pelaksanaDua.length - 1">, </span></span>)
                      </template>
                      <template v-else-if="item?.pegawai?.nama">
                        <span> / {{ item?.pegawai?.nama }}</span>
                      </template>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <div class="row q-my-xs">
                      <q-btn
                        flat
                        round
                        size="sm"
                        icon="icon-mat-delete"
                        color="negative"
                        @click="hapusItem(item.id)"
                      >
                        <q-tooltip>Hapus </q-tooltip>
                      </q-btn>
                    </div>
                    <q-item-label>
                      <q-badge
                        outline
                        color="primary"
                        :label="`Rp. ${formatRp(item.subtotal)}`"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator size="2px" />
              </q-card>
            </transition-group>
          </div>
        </q-scroll-area>
        <div v-else class="column full-height flex-center text-grey-7">
          <div class="f-14">Data Tindakan Belum Ada</div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { dateFullFormat, formatRp } from 'src/modules/formatter'
import { useDiagnosaHomeCare } from 'src/stores/simrs/homeCare/diagnosa'
import { computed } from 'vue'

const store = useDiagnosaHomeCare()
const $q = useQuasar()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const filterredTable = computed(() => {
  const val = store.notaTindakan
  const arr = props?.pasien?.tindakan
  if (!arr?.length) return []
  return (val === 'SEMUA' || val === 'BARU' || val === null || val === '') ? arr : arr?.filter(x => x?.rs2 === val)
})

function hapusItem (id) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.hapusTindakan(props.pasien, id)
  })
}

function setPelaksana (item) {
  const pel1 = item?.rs8 !== '' ? item?.rs8 : null
  const pel2 = item?.rs23 !== '' ? item?.rs23 : null

  const pelaksanaSatu = pel1 ? pel1.split(';').filter(Boolean) : []
  const pelaksanaDua = pel2 ? pel2.split(';').filter(Boolean) : []

  return { pelaksanaSatu, pelaksanaDua }
}

function namaPetugas (item) {
  const petugas = store.listPetugas?.find(x => x.kdpegsimrs === item)?.nama ?? item
  return petugas
}
</script>
