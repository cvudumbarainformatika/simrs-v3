<template>
  <div class="b q-pa-md">
    * Pemeriksasan Radiologi
    <div>
      <div class="q-ma-sm text-bold" v-for="(item, i) in props.pasien?.radiologi" :key="i">
        {{ item?.rs4 }} <br>
      </div>
    </div>
    * Hasil Bacaan Radiologi
    <div>
      <div v-for="(item, x) in props.pasien?.hasilradiologi" :key="x">
        {{ item?.rs3 }}
      </div>
    </div>
    <div class="row justify-end q-mt-xl">
      <div v-for="(dokter, index) in dokterRadiologis" :key="`${dokter.kdpegsimrs ?? dokter.nama}-${index}`" class="col-6 text-center">
        <div class="q-mb-sm">Dokter Radiologi</div>
        <div v-if="dokter.kdpegsimrs && dokter.nota" class="column items-center">
          <div class="radiologi-doctor-qr">
            <vue-qrcode :value="qrUrl(dokter.nota, dokter.kdpegsimrs)" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: { dark: '#000000', light: '#ffffff' },
              margin: 0
            }" />
          </div>
          <div class="f-10">Nota: {{ dokter.nota }}</div>
        </div>
        <div class="q-mt-sm text-weight-bold">
          {{ dokter.nama }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { findDokterRadiologi, normalizeDokterRadiologiName } from 'src/stores/simrs/radiologi/permintaan'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const doctors = ref([])

const dokterRadiologis = computed(() => {
  const hasilByPemeriksaan = (props.pasien?.radiologi ?? []).flatMap(permintaan =>
    (permintaan?.rincians ?? [])
      .filter(rincian => rincian?.pelaksana && (rincian?.rs2 || permintaan?.rs2))
      .map(rincian => ({
        nama: rincian.pelaksana,
        nota: rincian.rs2 || permintaan.rs2
      }))
  )
  const hasilBacaan = (props.pasien?.hasilradiologi ?? [])
    .filter(item => item?.rs4 && item?.rs5)
    .map(item => ({
      nama: item.rs4,
      nota: item.rs5,
      kdpegsimrs: item.dokter_radiologi?.kdpegsimrs
    }))
  const hasil = [...hasilBacaan, ...hasilByPemeriksaan]
  const kodeByNama = new Map(hasilBacaan
    .filter(item => item.kdpegsimrs)
    .map(item => [normalizeDokterRadiologiName(item.nama), item.kdpegsimrs]))

  const dokterByName = new Map()
  hasil.forEach(item => {
    const nama = String(item.nama).trim()
    const nota = String(item.nota).trim()
    if (!nama || !nota) return
    const normalizedName = normalizeDokterRadiologiName(nama)
    const kode = item.kdpegsimrs ?? kodeByNama.get(normalizedName)
    const dokter = kode
      ? { nama, kdpegsimrs: kode }
      : findDokterRadiologi(doctors.value, nama)
    const key = dokter?.kdpegsimrs ?? normalizedName
    if (!dokterByName.has(key)) {
      dokterByName.set(key, {
        nama: dokter?.nama ?? nama,
        kdpegsimrs: dokter?.kdpegsimrs ?? null,
        nota
      })
    }
  })

  return [...dokterByName.values()]
})

onMounted(async () => {
  try {
    const { data } = await api.get('/v1/simrs/master/pegawai/listnakes')
    const nakes = Array.isArray(data) ? data : data?.data
    if (!Array.isArray(nakes)) {
      throw new TypeError('Respons daftar petugas bukan array')
    }
    doctors.value = nakes.filter(petugas => String(petugas?.kdgroupnakes) === '1')
  } catch (error) {
    console.error('Gagal memuat daftar dokter radiologi', error)
  }
})

function qrUrl (nota, kdpegsimrs) {
  const encoded = btoa(`${nota}|RADIOLOGI.png|RADIOLOGI|${kdpegsimrs}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${encoded}`
}
</script>
<style scoped>
.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.radiologi-doctor-qr {
  width: 100px;
}
</style>
