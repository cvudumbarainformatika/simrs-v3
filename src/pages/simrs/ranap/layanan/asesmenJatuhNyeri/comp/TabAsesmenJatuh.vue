<template>
  <div class="fit column relative-position bg-grey-2">
    <!-- Header Toolbar -->
    <div class="col-auto bg-primary text-white q-px-md q-py-sm shadow-1">
      <div class="row justify-between items-center">
        <div class="text-subtitle1 text-weight-bold row items-center q-gutter-x-sm">
          <q-icon name="icon-my-personal_injury" color="white" size="sm" />
          <span>Daftar Asesmen Risiko Jatuh Ulang</span>
        </div>
        <div>
          <q-btn rounded outline color="white" :loading="storeUlang.loading" @click="bukaForm">
            <q-icon name="icon-mat-add" size="xs" />
            <span class="q-ml-xs">Tambah</span>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- List Data -->
    <div class="col q-pa-md scroll">
      <div v-if="storeUlang.loading" class="fit flex flex-center bg-white" style="border-radius: 8px; border: 1px solid #ddd; min-height: 350px;">
        <q-spinner color="primary" size="3em" />
        <div class="text-grey-6 q-ml-md">Memuat data riwayat...</div>
      </div>

      <div v-else-if="!mappedItems.length" class="fit flex flex-center bg-white" style="border-radius: 8px; border: 1px solid #ddd; min-height: 350px;">
        <div class="text-center">
          <q-icon name="icon-my-personal_injury" size="80px" color="grey-4" />
          <div class="text-h6 text-grey-5 q-mt-md">Belum Ada Riwayat Asesmen Jatuh</div>
          <div class="text-caption text-grey-4">Silakan klik tombol Tambah untuk membuat penilaian baru</div>
        </div>
      </div>

      <div v-else class="q-gutter-y-sm">
        <q-card v-for="(item, idx) in mappedItems" :key="item.id || idx" flat bordered class="q-mb-sm">
          <q-list class="rounded-borders">
            <q-expansion-item>
              <template #header>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="32px">
                    <div>{{ item.petugas ? item.petugas.slice(0,2).toUpperCase() : 'N' }}</div>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div class="row items-center q-gutter-x-sm">
                    <span class="text-weight-bold text-dark">PPA</span>
                    <span class="text-grey-7">- {{ item.petugas }}</span>
                  </div>
                  <div class="text-caption text-grey-6">{{ item.tanggal }}</div>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-x-md">
                    <div class="text-right">
                      <div class="text-subtitle2 text-weight-bold">
                        Skor: <span class="text-accent">{{ item.skor }}</span>
                      </div>
                      <div class="text-caption text-grey-8">
                        Kategori: <span class="text-weight-bold text-negative">{{ item.kategori }}</span>
                      </div>
                    </div>
                    <q-badge v-if="item.kuning" color="yellow-9" text-color="black" class="q-pa-xs">Stiker Kuning</q-badge>
                    <q-badge color="primary" outline class="text-capitalize">{{ item.metode }}</q-badge>
                  </div>
                </q-item-section>
              </template>

              <q-separator />

              <q-card class="bg-grey-1">
                <q-card-section class="q-pa-md">
                  <div class="text-weight-bold text-grey-8 q-mb-sm">Rincian Penilaian Risiko Jatuh ({{ item.metode.toUpperCase() }}):</div>
                  <div class="row q-col-gutter-sm">
                    <div v-for="(val, kIdx) in item.details" :key="kIdx" class="col-12 col-sm-6">
                      <div class="row justify-between border-b q-py-xs">
                        <div class="text-grey-7">{{ val.label }}:</div>
                        <div class="text-weight-bold text-dark">{{ val.value }} (Skor: {{ val.skor }})</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Dialog Input Form -->
    <q-dialog v-model="dialogForm" persistent max-width="800px" width="100%">
      <q-card style="min-width: 750px; max-width: 850px;">
        <q-card-section class="row items-center bg-primary text-white q-py-sm">
          <div class="text-h6 text-weight-bold">Form Input Asesmen Risiko Jatuh Ulang</div>
          <q-space />
          <q-btn icon="icon-mat-close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="scroll" style="max-height: 70vh;">
          <div class="row q-col-gutter-sm">
            <div class="col-12 q-mb-md">
              <div class="bg-indigo-1 q-pa-sm rounded-borders text-indigo-10">
                <div>Usia Pasien: <strong>{{ store.usia }} Tahun</strong></div>
                <div>Metode Skoring Otomatis: <strong class="text-uppercase text-negative">{{ openSkoringJatuh || 'Belum Ditentukan' }}</strong></div>
              </div>
            </div>

            <!-- Humpty Dumpty Form -->
            <div v-if="openSkoringJatuh === 'humpty'" class="col-12">
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">{{ store?.humptys?.desc }}</div>
              <q-separator class="q-mb-md" />
              <div v-if="store.formHumpty" class="q-gutter-y-md">
                <div v-for="obj in store.humptys?.form" :key="obj.kode" class="border-b q-pb-sm">
                  <div class="row items-center">
                    <div class="col-3 text-weight-bold text-grey-9">{{ obj?.label }}</div>
                    <div class="col-9 row q-col-gutter-xs">
                      <div v-for="(item, i) in obj?.categories" :key="i" class="col-6">
                        <q-radio dense size="sm" v-model="store.formHumpty[obj.kode]" :val="item" :label="`${item?.label} (Skor: ${item?.skor})`" @update:model-value="store.hitungSkorHumpty" />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="store.formHumpty?.skorHumpty" class="bg-grey-3 q-pa-md rounded-borders flex justify-between items-center q-mt-md">
                  <div class="text-h6 text-accent">Total Skor: {{ store.formHumpty.skorHumpty?.skor }}</div>
                  <div class="text-h6 text-negative">Kategori: {{ store.formHumpty.skorHumpty?.label }}</div>
                </div>
              </div>
            </div>

            <!-- Morse Fall Scale Form -->
            <div v-if="openSkoringJatuh === 'morse'" class="col-12">
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">{{ store?.morses?.desc }}</div>
              <q-separator class="q-mb-md" />
              <div v-if="store.formMorse" class="q-gutter-y-md">
                <div v-for="obj in store.morses?.form" :key="obj.kode" class="border-b q-pb-sm">
                  <div class="row items-center">
                    <div class="col-3 text-weight-bold text-grey-9">{{ obj?.label }}</div>
                    <div class="col-9 row q-col-gutter-xs">
                      <div v-for="(item, i) in obj?.categories" :key="i" class="col-6">
                        <q-radio dense size="sm" v-model="store.formMorse[obj.kode]" :val="item" :label="`${item?.label} (Skor: ${item?.skor})`" @update:model-value="store.hitungSkorMorse" />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="store.formMorse?.skorMorse" class="bg-grey-3 q-pa-md rounded-borders flex justify-between items-center q-mt-md">
                  <div class="text-h6 text-accent">Total Skor: {{ store.formMorse.skorMorse?.skor }}</div>
                  <div class="text-h6 text-negative">Kategori: {{ store.formMorse.skorMorse?.label }}</div>
                </div>
              </div>
            </div>

            <!-- Ontario / Sidney Scale Form -->
            <div v-if="openSkoringJatuh === 'ontario'" class="col-12">
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">{{ store?.ontarios?.desc }}</div>
              <q-separator class="q-mb-md" />
              <div v-if="store.formOntario" class="q-gutter-y-md">
                <div v-for="obj in store.ontarios?.form" :key="obj.kode" class="border-b q-pb-sm">
                  <div v-if="obj.submenu?.length">
                    <div class="text-weight-bold text-grey-9 q-mb-xs">{{ obj?.label }} :</div>
                    <q-list bordered separator class="rounded-borders">
                      <q-item v-for="item in obj.submenu" :key="item.kode">
                        <q-item-section>
                          <q-item-label>{{ item?.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <div class="flex q-gutter-x-sm">
                            <q-radio dense size="sm" v-for="n in item.categories" :key="n.label" v-model="store.formOntario[item.kode]" :val="n" :label="`${n?.label} (${n?.skor})`" @update:model-value="store.hitungSkorOntario()" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div v-else class="row items-center">
                    <div class="col-5 text-weight-bold text-grey-9">{{ obj?.label }}</div>
                    <div class="col-7 column q-gutter-y-xs">
                      <q-radio dense size="sm" v-for="n in obj.categories" :key="n.label" v-model="store.formOntario[obj.kode]" :val="n" :label="`${n?.label} (Skor: ${n?.skor})`" @update:model-value="store.hitungSkorOntario()" />
                    </div>
                  </div>
                </div>
                <div v-if="store.formOntario?.skorOntario" class="bg-grey-3 q-pa-md rounded-borders flex justify-between items-center q-mt-md">
                  <div class="text-h6 text-accent">Total Skor: {{ store.formOntario.skorOntario?.skor }}</div>
                  <div class="text-h6 text-negative">Kategori: {{ store.formOntario.skorOntario?.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Batal" color="grey" flat v-close-popup />
          <q-btn label="Simpan Penilaian" color="primary" :loading="storeUlang.loadingSave" @click="simpanPenilaian" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePenilaianRanapStore } from 'src/stores/simrs/ranap/penilaian.js'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri.js'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const store = usePenilaianRanapStore()
const storeUlang = useAsesmenJatuhNyeriStore()
const dialogForm = ref(false)

onMounted(async () => {
  await store.getMaster()
  store.getUsia(props.pasien)
  storeUlang.getData(props.pasien)
})

const mappedItems = computed(() => {
  return storeUlang.itemsJatuh.map(item => {
    let detailsArr = []
    if (item.details) {
      const parsed = typeof item.details === 'string' ? JSON.parse(item.details) : item.details
      if (Array.isArray(parsed)) {
        detailsArr = parsed
      } else if (typeof parsed === 'object') {
        detailsArr = Object.keys(parsed).map(k => ({
          label: k,
          value: parsed[k]?.label ?? parsed[k]?.value ?? '-',
          skor: parsed[k]?.skor ?? 0
        }))
      }
    }
    return {
      id: item.id,
      tanggal: item.created_at || item.tanggal,
      petugas: item.pegawai?.nama || item.kdpegsimrs || 'Petugas',
      metode: item.metode,
      skor: item.skor,
      kategori: item.kategori,
      kuning: !!item.kuning,
      details: detailsArr
    }
  })
})

const openSkoringJatuh = computed(() => {
  let open = null
  if (store.usia >= 60) {
    open = 'ontario'
  } else if (store.usia >= 18 && store.usia < 60) {
    open = 'morse'
  } else if (store.usia < 18) {
    open = 'humpty'
  }
  return open
})

function bukaForm() {
  store.initReset(props.pasien)
  dialogForm.value = true
}

async function simpanPenilaian() {
  let skor = 0
  let kategori = 'Risiko Rendah'
  let kuning = false
  let detailsObj = {}

  if (openSkoringJatuh.value === 'humpty') {
    skor = store.formHumpty?.skorHumpty?.skor ?? 0
    kategori = store.formHumpty?.skorHumpty?.label ?? 'Risiko Rendah'
    kuning = store.formHumpty?.skorHumpty?.kuning ?? false
    Object.keys(store.formHumpty).forEach(key => {
      if (key !== 'skorHumpty' && store.formHumpty[key]) {
        detailsObj[key] = {
          label: store.humptys?.form?.find(x => x.kode === key)?.label || key,
          value: store.formHumpty[key].label,
          skor: store.formHumpty[key].skor
        }
      }
    })
  } else if (openSkoringJatuh.value === 'morse') {
    skor = store.formMorse?.skorMorse?.skor ?? 0
    kategori = store.formMorse?.skorMorse?.label ?? 'Risiko Rendah'
    kuning = store.formMorse?.skorMorse?.kuning ?? false
    Object.keys(store.formMorse).forEach(key => {
      if (key !== 'skorMorse' && store.formMorse[key]) {
        detailsObj[key] = {
          label: store.morses?.form?.find(x => x.kode === key)?.label || key,
          value: store.formMorse[key].label,
          skor: store.formMorse[key].skor
        }
      }
    })
  } else if (openSkoringJatuh.value === 'ontario') {
    skor = store.formOntario?.skorOntario?.skor ?? 0
    kategori = store.formOntario?.skorOntario?.label ?? 'Risiko Rendah'
    kuning = store.formOntario?.skorOntario?.kuning ?? false
    Object.keys(store.formOntario).forEach(key => {
      if (key !== 'skorOntario' && store.formOntario[key]) {
        let field = store.ontarios?.form?.find(x => x.kode === key)
        if (!field) {
          store.ontarios?.form?.forEach(f => {
            if (f.submenu) {
              const sub = f.submenu.find(s => s.kode === key)
              if (sub) field = sub
            }
          })
        }
        detailsObj[key] = {
          label: field?.label || key,
          value: store.formOntario[key].label,
          skor: store.formOntario[key].skor
        }
      }
    })
  }

  const payload = {
    noreg: props.pasien?.noreg,
    norm: props.pasien?.norm,
    kdruang: props.pasien?.kdruangan,
    metode: openSkoringJatuh.value,
    skor,
    kategori,
    kuning: kuning ? 1 : 0,
    details: detailsObj
  }

  const success = await storeUlang.simpanJatuh(props.pasien, payload)
  if (success) {
    dialogForm.value = false
  }
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid #ddd;
}
</style>
