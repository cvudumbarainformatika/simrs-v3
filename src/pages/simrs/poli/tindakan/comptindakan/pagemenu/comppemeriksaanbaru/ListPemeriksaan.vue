<template>
  <q-card
    flat
    square
    class="full-height"
  >
    <div class="column full-height">
      <div class="col-auto bg-teal text-white">
        <div class="q-px-sm q-py-xs">
          Pemeriksaan Fisik tersimpan
        </div>
      </div>
      <div class="col-grow">
        <q-scroll-area
          v-if="pasien?.pemeriksaanfisik?.length"
          style="height:calc(100% - 1px)"
        >
          <q-card
            flat
            bordered
            square
            dark
          >
            <q-list
              separator
            >
              <transition-group name="list">
                <template
                  v-for="(item, i) in pasien?.pemeriksaanfisik"
                  :key="i"
                >
                  <!-- NADI-->
                  <q-item
                    class="q-pa-xs list-move"
                    dark
                  >
                    <q-item-section avatar>
                      <q-icon
                        :color="nadi(item?.rs4).color"
                        name="icon-my-monitor_heart"
                        size="lg"
                      />
                    </q-item-section>
                    <q-item-section class="q-pa-xs">
                      <q-item-label
                        :class="`text-h4 text-${nadi(item?.rs4).color}`"
                      >
                        {{ item?.rs4 }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section
                      side
                    >
                      <q-item-label class="text-right f-10">
                        N (HR)
                      </q-item-label>
                      <q-item-label class="text-right f-10">
                        {{ nadi(item?.rs4).res }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- PERNAPASAN -->
                  <q-separator
                    dark
                    inset
                  />
                  <q-item
                    class="q-pa-xs list-move"
                    dark
                  >
                    <q-item-section avatar>
                      <q-icon
                        color="white"
                        name="icon-my-local_hospital"
                        size="lg"
                      />
                    </q-item-section>
                    <q-item-section class="q-pa-xs">
                      <q-item-label
                        :class="`text-h4 text-white`"
                      >
                        {{ item?.pernapasan }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section
                      side
                    >
                      <q-item-label class="text-right f-10">
                        RR
                      </q-item-label>
                      <q-item-label class="text-right f-10">
                        -
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- SUHU TUBUH -->
                  <q-separator
                    dark
                    inset
                  />
                  <q-item
                    class="q-pa-xs list-move"
                    dark
                  >
                    <q-item-section avatar>
                      <q-icon
                        :color="suhu(item?.suhutubuh).color"
                        name="icon-my-standing-human-body-silhouette-svgrepo-com"
                        size="lg"
                      />
                    </q-item-section>
                    <q-item-section class="q-pa-xs">
                      <q-item-label
                        :class="`text-h4 text-${suhu(item?.suhutubuh).color}`"
                      >
                        {{ item?.suhutubuh }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section
                      side
                    >
                      <q-item-label class="text-right f-10">
                        SUHU TUBUH
                      </q-item-label>
                      <q-item-label class="text-right f-10">
                        {{ suhu(item?.suhutubuh).res }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- TEKaNAN darah -->
                  <q-separator
                    dark
                    inset
                  />
                  <q-item
                    class="q-pa-xs list-move"
                    dark
                  >
                    <q-item-section class="q-pa-xs">
                      <q-item-label
                        :class="`text-h5 `"
                      >
                        <span :class="`${tekananDarah(item?.sistole).color}`">{{ item?.sistole }}</span> /
                        <span :class="`${tekananDarahDias(item?.diatole).color}`">{{ item?.diastole }}</span>
                      </q-item-label>
                      <q-item-label class="f-10">
                        <span :class="`${tekananDarah(item?.sistole).color}`">{{ tekananDarah(item?.sistole).res }}</span> /
                        <span :class="`${tekananDarahDias(item?.diastole).color}`">{{ tekananDarahDias(item?.diastole).res }}</span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section
                      side
                    >
                      <q-item-label class="text-right f-10">
                        TD sys / dias
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- STATUS -->
                  <q-separator
                    dark
                    inset
                  />

                  <q-item>
                    <q-item-section>
                      <div class="row full-width flex-center">
                        <q-btn
                          outline
                          style="color: goldenrod;"
                          no-caps
                          dense
                          size="sm"
                          class="q-px-sm"
                        >
                          <div class="column">
                            <div class="f-14">
                              {{ item?.tinggibadan }} cm
                            </div>
                            <div class="f-10">
                              Tinggi Badan
                            </div>
                          </div>
                        </q-btn>
                        <q-btn
                          outline
                          style="color: goldenrod;"
                          no-caps
                          dense
                          size="sm"
                          class="q-px-sm"
                        >
                          <div class="column">
                            <div class="f-14">
                              {{ item?.beratbadan }} kg
                            </div>
                            <div class="f-10">
                              Berat Badan
                            </div>
                          </div>
                        </q-btn>
                        <q-btn
                          outline
                          style="color: goldenrod;"
                          no-caps
                          dense
                          size="sm"
                          class="q-px-sm"
                        >
                          <div class="column">
                            <div class="f-14">
                              {{ item?.vas }}
                            </div>
                            <div class="f-10">
                              VAS
                            </div>
                          </div>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-separator
                    dark
                    inset
                  />
                  <q-item
                    class="q-pa-xs list-move"
                    dark
                  >
                    <q-item-section class="q-pa-xs">
                      <q-item-label
                        lines="2"
                      >
                        T Kesadaran : <em>{{ getKesadaran(item?.tingkatkesadaran)??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Status Psikologis : <em>{{ item?.statuspsikologis??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Ekonomi : <em>{{ item?.sosialekonomi??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Spiritual : <em>{{ item?.spiritual??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        kesadaran : <em>{{ item?.kesadaran??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Status Neurologis : <em>{{ item?.statusneurologis??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Muakuloskeletal : <em>{{ item?.muakuloskeletal??'-' }}</em>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- ========================================================================================== KHUSUS PARU POL018-->
                  <q-separator
                    dark
                    inset
                  />
                  <q-item
                    v-if="pasien?.kodepoli==='POL018'"
                    class="q-pa-xs list-move"
                    dark
                  >
                    <q-item-section class="q-pa-xs">
                      <q-item-label
                        lines="2"
                      >
                        Inspeksi : <em>{{ item?.inspeksi?? '-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Palpasi : <em>{{ item?.palpasi??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Perkusi Dada Kanan : <em>{{ item?.perkusidadakanan??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Perkusi Dada Kiri : <em>{{ item?.perkusidadakiri??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Suara Nafas Dasar : <em>{{ item?.auskultasisuaradasar??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Suara Nafas Tambahan (Kanan) : <em>{{ item?.auskultasisuaratambahankanan??'-' }}</em>
                      </q-item-label>
                      <q-item-label
                        lines="2"
                      >
                        Suara Nafas Tambahan (Kiri) : <em>{{ item?.auskultasisuaratambahankiri??'-' }}</em>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- DETAIL -->
                  <div class="q-pa-sm flex items-center">
                    <!-- <q-btn
                      color="grey"
                      round
                      flat
                      dense
                      :icon="expanded===i+1 ? 'icon-mat-keyboard_arrow_up' : 'icon-mat-keyboard_arrow_down'"
                      @click="expand(i)"
                    /> -->
                    <q-space />
                    <div class="q-gutter-sm">
                      <q-btn
                        flat
                        round
                        size="sm"
                        icon="icon-mat-edit"
                        color="yellow"
                        @click="editForm(item)"
                      >
                        <q-tooltip>
                          Edit Pemeriksaan ?
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        size="sm"
                        icon="icon-mat-delete"
                        color="negative"
                        @click="hapusItem(item.id)"
                      >
                        <q-tooltip>
                          Hapus Pemeriksaan ?
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                  <q-card
                    flat
                    dark
                    square
                  >
                    <q-slide-transition>
                      <!-- <div v-show="expanded===i+1"> -->
                      <div>
                        <q-separator dark />
                        <q-list
                          v-if="item.detailgambars?.length"
                          separator
                          dark
                        >
                          <q-item
                            v-for="(row, n) in item.detailgambars"
                            :key="n"
                          >
                            <q-item-section avatar>
                              <q-avatar
                                size="24px"
                                color="orange"
                              >
                                {{ n + 1 }}
                              </q-avatar>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ row.anatomy }}</q-item-label>
                              <q-item-label v-if="item?.pemeriksaankhususmata?.length">
                                <div class="column q-ml-sm">
                                  <div><em>Details Pemeriksaan (Khusus Mata)</em></div>
                                  <div class="q-ml-sm">
                                    <div>- VOD AWAL : <b>{{ item?.pemeriksaankhususmata[n]?.rs4 ?? '-' }}</b></div>
                                    <div>- VOD REFR : <b>{{ item?.pemeriksaankhususmata[n]?.rs5 ?? '-' }}</b></div>
                                    <div>- VOD AKHIR : <b>{{ item?.pemeriksaankhususmata[n]?.rs6 ?? '-' }}</b></div>
                                    <div>- TOD : <b>{{ item?.pemeriksaankhususmata[n]?.rs10 ?? '-' }}</b></div>
                                    <div>- FONDOS OD : <b>{{ item?.pemeriksaankhususmata[n]?.rs12 ?? '-' }}</b></div>
                                    <div>- VOS AWAL : <b>{{ item?.pemeriksaankhususmata[n]?.rs7 ?? '-' }}</b></div>
                                    <div>- VOS REFR : <b>{{ item?.pemeriksaankhususmata[n]?.rs8 ?? '-' }}</b></div>
                                    <div>- VOS AKHIR : <b>{{ item?.pemeriksaankhususmata[n]?.rs9 ?? '-' }}</b></div>
                                    <div>- TOS : <b>{{ item?.pemeriksaankhususmata[n]?.rs11 ?? '-' }}</b></div>
                                    <div>- FONDOS OS : <b>{{ item?.pemeriksaankhususmata[n]?.rs13 ?? '-' }}</b></div>
                                  </div>
                                </div>
                              </q-item-label>
                              <q-item-label caption>
                                {{ row.ket }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                        <div
                          v-else
                          class="text-center q-pa-md"
                        >
                          Tidak ada detail anatomy
                        </div>
                      </div>
                    </q-slide-transition>
                  </q-card>
                  <q-separator
                    color="grey"
                    size="5px"
                  />
                </template>
              </transition-group>
            </q-list>
          </q-card>
        </q-scroll-area>
        <div
          v-else
          class="column flex-center full-height"
        >
          Data Pemeriksaan Belum Ada
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
// import CompMonitor from './CompMonitor.vue'
// import CompTd from './CompTd.vue'
// import CompPsiko from './CompPsiko.vue'
// import { ref } from 'vue'

import { usePemeriksaanFisik } from 'src/stores/simrs/pelayanan/poli/pemeriksaanfisik'
import { useQuasar } from 'quasar'
// import { ref } from 'vue'

const store = usePemeriksaanFisik()
const $q = useQuasar()

// const expanded = ref(0)
// function expand(i) {
//   expanded.value === i + 1 ? expanded.value === 0 ? expanded.value = i + 1 : expanded.value = 0 : expanded.value = i + 1
// }
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

function getKesadaran(val) {
  const temp = store.optionsTingkatkesadaran.filter(a => a.value === parseInt(val))
  if (temp?.length) {
    return temp[0].label
  } else {
    return '-'
  }
}
// eslint-disable-next-line no-unused-vars
function tekananDarah(val) {
  const normal = val >= 100 && val <= 120
  const prahipertensi = val >= 121 && val <= 139
  const hipertensiderajat1 = val >= 140 && val <= 159
  const hipertensiderajat2 = val >= 160

  let obj = {
    color: 'text-teal',
    res: 'normal'
  }
  if (normal) {
    obj = { color: 'text-teal', res: 'Normal' }
  } else if (prahipertensi) {
    obj = { color: 'text-red', res: 'Prahipertensi' }
  } else if (hipertensiderajat1) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 1' }
  } else if (hipertensiderajat2) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 2' }
  } else {
    obj = { color: 'text-red', res: 'Not Valid' }
  }

  return obj
}
// eslint-disable-next-line no-unused-vars
function tekananDarahDias(val) {
  const normal = val >= 60 && val <= 79
  const prahipertensi = val >= 80 && val <= 89
  const hipertensiderajat1 = val >= 90 && val <= 99
  const hipertensiderajat2 = val >= 100

  let obj = {
    color: 'text-teal',
    res: 'normal'
  }
  if (normal) {
    obj = { color: 'text-teal', res: 'Normal' }
  } else if (prahipertensi) {
    obj = { color: 'text-red', res: 'Prahipertensi' }
  } else if (hipertensiderajat1) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 1' }
  } else if (hipertensiderajat2) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 2' }
  } else {
    obj = { color: 'text-red', res: 'LOW' }
  }

  return obj
}
// eslint-disable-next-line no-unused-vars
function suhu(val) {
  const hipotermia = val < 35
  const normal = val >= 35 && val < 37
  const pireksia = val >= 37 && val <= 41.1
  const hipertermia = val > 41.1

  let obj = {
    color: 'teal',
    res: 'normal'
  }
  if (hipotermia) {
    obj = { color: 'red', res: 'Hipotermia' }
  } else if (normal) {
    obj = { color: 'teal', res: 'Normal' }
  } else if (pireksia) {
    obj = { color: 'red', res: 'Pireksia/febris' }
  } else if (hipertermia) {
    obj = { color: 'red', res: 'Hipertermia' }
  }

  return obj
}
// eslint-disable-next-line no-unused-vars
function nadi(val) {
  const bradikardi = val < 60
  const normal = val >= 61 && val <= 100
  const takikardi = val > 100

  let obj = {
    color: 'teal',
    res: 'Normal'
  }
  if (bradikardi) {
    obj = { color: 'red', res: 'Brakikardi' }
  } else if (normal) {
    obj = { color: 'teal', res: 'Normal' }
  } else if (takikardi) {
    obj = { color: 'red', res: 'Takikardi' }
  }

  return obj
}

function hapusItem(id) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // console.log('OK')
    store.deleteData(props.pasien, id)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function editForm(item) {
  store.editForm(item, props?.pasien)
}
</script>

<style lang="scss" scoped>
.q-item {
  .q-item__section {
      .q-item__label {
      // font-size: 10px;
    }
  }
}

</style>
