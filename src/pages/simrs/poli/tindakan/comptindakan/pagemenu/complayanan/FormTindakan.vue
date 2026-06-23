<template>
  <div class="q-pa-md text-weight-bold">
    FORM Tindakan
    <!-- <div class="f-10 text-weight-light">
      <em>form Tindakan sekaligus pensimulasian INACBG </em>
    </div> -->
  </div>
  <q-separator />
  <q-scroll-area style="height: calc(100% - 50px);">
    <q-form ref="formmRef" class="row q-pa-md q-col-gutter-sm" @submit="onSubmit">
      <div class="col-12 q-mb-sm">
        <q-select v-model="store.searchtindakan" use-input hide-selected fill-input outlined standout="bg-yellow-3"
          dense emit-value map-options option-value="kdtindakan"
          :option-label="opt => Object(opt) === opt && 'tindakan' in opt ? opt.kdtindakan + ' ~ ' + opt.tindakan + ' --> ' + opt.icd9 : ' Cari Tindakan '"
          input-debounce="0" :options="options" label="Cari Tindakan" @filter="filterFn"
          @update:model-value="(val) => updateSearchTindakan(val)">
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Tidak ditemukan
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12">
        <q-input v-model="store.formtindakan.tindakan" label="Tindakan (Otomatis)" dense outlined standout="bg-yellow-3"
          :rules="[val => !!val || 'Harus diisi']" hide-bottom-space readonly />
      </div>

      <div class="col-9">
        <q-input v-model="store.formtindakan.tarif" label="Biaya (Otomatis)" dense outlined standout="bg-yellow-3"
          :rules="[val => !!val || 'Harus diisi']" hide-bottom-space readonly />
      </div>
      <div class="col-3">
        <q-input ref="inpQtyRef" v-model="store.formtindakan.jmltindakan" label="Qty" dense outlined
          standout="bg-yellow-3" :rules="[val => !!val || 'Harus diisi',
          val => !isNaN(val) || 'Harus pakai Nomor',
          ]" hide-bottom-space />
      </div>
      <div class="col-12">
        <q-input v-model="store.formtindakan.keterangan" label="Keterangan" autogrow outlined standout="bg-yellow-3"
          hide-bottom-space />
      </div>
      <div class="col-12">
        <q-separator class="q-my-md" />
      </div>
      <!-- <div
        v-if="store.searchtindakan==='T00204'"
        class="col-12"
      >
        {{ store.searchtindakan }}
      </div> -->
      <div class="col-12 text-right">
        <q-btn label="Simpan Tindakan" color="primary" type="submit" :loading="store.loadingFormTindakan"
          :disable="store.loadingFormTindakan" />
      </div>
    </q-form>
    <!-- <div class="q-pb-xl" /> -->
  </q-scroll-area>
</template>

<script setup>
import { useLayananPoli } from 'src/stores/simrs/pelayanan/poli/layanan'
import { computed, onMounted, ref } from 'vue'

const store = useLayananPoli()

const options = ref([])
const formmRef = ref(null)
const inpQtyRef = ref(null)

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})


// filter tindakan
const listTindakanTerseleksi = computed(() => {
  console.log(props.pasien)
  const dataAsli = store.listTindakan
  const ruanganPasien = props.pasien?.kodepoli

  // -------------------------------------------------------------
  // LANGKAH 1: Hitung kemunculan nama tindakan & Kelompokkan
  // -------------------------------------------------------------
  const counts = {}
  dataAsli.forEach(item => {
    counts[item.tindakan] = (counts[item.tindakan] || 0) + 1
  })

  // Pisahkan yang unik sejak awal
  const dataUnik = dataAsli.filter(item => counts[item.tindakan] === 1)
  const dataDuplikatMentah = dataAsli.filter(item => counts[item.tindakan] > 1)

  // Kelompokkan data duplikat berdasarkan nama tindakannya
  // Contoh: { "Reparasi Protesa": [obj1, obj2], "Tindakan B": [obj3, obj4] }
  const groupedDuplikat = {}
  dataDuplikatMentah.forEach(item => {
    if (!groupedDuplikat[item.tindakan]) {
      groupedDuplikat[item.tindakan] = []
    }
    groupedDuplikat[item.tindakan].push(item)
  })

  // -------------------------------------------------------------
  // LANGKAH 2 & 3: Seleksi kelompok duplikat untuk ambil 1 pemenang
  // -------------------------------------------------------------
  const pemenangDuplikat = []

  Object.keys(groupedDuplikat).forEach(namaTindakan => {
    const kandidat = groupedDuplikat[namaTindakan]

    // ATURAN 2: Prioritaskan tindakan yang ada di ruangan pasien (kdpoli mengandung rs4)
    const cocokRuangan = kandidat.filter(item => {
      if (!item.kdpoli || !ruanganPasien) return false
      return item.kdpoli.split('|').includes(ruanganPasien)
    })

    // Jika tepat ada 1 yang cocok ruangan pasien, dia langsung menang
    if (cocokRuangan.length === 1) {
      pemenangDuplikat.push(cocokRuangan[0])
      return // Lanjut ke nama tindakan berikutnya
    }

    // Jika ada banyak yang cocok ruangan, atau tidak ada sama sekali yang cocok,
    // kita gunakan array 'kandidatEliminasi' untuk lanjut ke filter tarif
    const kandidatEliminasi = cocokRuangan.length > 1 ? cocokRuangan : kandidat

    // ATURAN 3: Cek apakah tarifnya sama semua atau beda
    const tarifPertama = kandidatEliminasi[0].tarif
    const apakahSemuaTarifSama = kandidatEliminasi.every(item => item.tarif === tarifPertama)

    if (apakahSemuaTarifSama) {
      // Jika tarif sama, ambil salah satu saja (yang pertama)
      pemenangDuplikat.push(kandidatEliminasi[0])
    } else {
      // Jika tarif beda, ambil yang kode ruangan-nya paling banyak BUKAN "POL%"
      let pemenangSementera = kandidatEliminasi[0]
      let jumlahNonPolTerbanyak = -1

      kandidatEliminasi.forEach(item => {
        const daftarKode = item.kdpoli ? item.kdpoli.split('|') : []
        // Hitung berapa banyak kode yang TIDAK dimulai dengan "POL"
        const jumlahNonPol = daftarKode.filter(kode => !kode.startsWith('POL')).length

        if (jumlahNonPol > jumlahNonPolTerbanyak) {
          jumlahNonPolTerbanyak = jumlahNonPol
          pemenangSementera = item
        }
      })

      pemenangDuplikat.push(pemenangSementera)
    }
  })

  // -------------------------------------------------------------
  // LANGKAH FINAL: Satukan data unik dengan pemenang duplikat
  // -------------------------------------------------------------
  return [...dataUnik, ...pemenangDuplikat]
})
const KODE_POLI_MAP = {
  POL042: 'POL018',
}
const normalizeKodePoli = (kode) => {
  return KODE_POLI_MAP[kode] ?? kode
}
const POLI_EQUIVALENT = {
  POL042: ['POL018'],
}
const getPoliCandidates = (kode) => {
  const equ = POLI_EQUIVALENT[kode]
    ? [kode, ...POLI_EQUIVALENT[kode]]
    : [kode]
  // console.log('equ', equ)

  return equ
}
// normalize rs4 legacy:
// - memastikan selalu diawali & diakhiri '|'
// - TIDAK memperbaiki isi di tengah
// - mencegah false match saat includes('|KODE|')
const normalizeRs4 = (rs4) => {
  if (!rs4) return ''
  let s = rs4
  if (!s.startsWith('|')) s = '|' + s
  if (!s.endsWith('|')) s = s + '|'
  return s
}
const matchRs4 = (rs4, kodePoli) => {
  const safeRs4 = normalizeRs4(rs4)
  const poli = getPoliCandidates(kodePoli)
    .some(k => safeRs4.includes(`|${k}|`))
  // console.log('poli', poli)

  return poli
}
onMounted(() => {
  // const kodePoli = normalizeKodePoli(props.pasien?.kodepoli)
  const kodePoli = props.pasien?.kodepoli
  // console.log('kodePoli', kodePoli)

  // if (kodePoli === 'POL041') options.value = store.listTindakan
  // else options.value = store.listTindakan?.filter(x => x.kdpoli?.includes(kodePoli))
  // if (kodePoli === 'POL041' || kodePoli === 'PEN001') options.value = listTindakanTerseleksi.value
  if (kodePoli === 'POL041' || kodePoli === 'OPERASI') options.value = listTindakanTerseleksi.value
  else options.value = store.listTindakan?.filter(x => matchRs4(x.kdpoli, kodePoli))
  // console.log('options', options.value)
  // store.initReset()
  // formmRef.value?.resetValidation()
})

function filterFn (val, update, abort) {
  if (val?.length < 1) {
    abort()
    return
  }

  update(() => {
    // const kodePoli = normalizeKodePoli(props.pasien.kodepoli)
    const kodePoli = props.pasien?.kodepoli
    const needle = val.toLowerCase()
    // const arr = kodePoli === 'POL041' ? store.listTindakan : store.listTindakan?.filter(x => x.kdpoli?.includes(kodePoli))
    // const arr = kodePoli === 'POL041' || kodePoli === 'PEN001' ? listTindakanTerseleksi.value : store.listTindakan?.filter(x => matchRs4(x.kdpoli, kodePoli))
    const arr = kodePoli === 'POL041' || kodePoli === 'OPERASI' ? listTindakanTerseleksi.value : store.listTindakan?.filter(x => matchRs4(x.kdpoli, kodePoli))
    console.log('arr', kodePoli, arr, store.listTindakan)
    const filter = ['kdtindakan', 'tindakan', 'icd9']
    const multiFilter = (data = [], filterKeys = [], value = '') =>
      data.filter((item) => filterKeys.some(
        (key) =>
          item[key]?.toString()?.toLowerCase()?.includes(value.toLowerCase()) &&
          item[key]
      )
      )
    const filteredData = multiFilter(arr, filter, needle)
    options.value = filteredData
  })
}

function updateSearchTindakan (val) {
  store.setKdTindakan(val).then(() => {
    inpQtyRef.value.focus()
  })
}

function onSubmit () {
  store.saveTindakan(props.pasien).then(() => {
    formmRef.value.resetValidation()
  })
}



</script>
