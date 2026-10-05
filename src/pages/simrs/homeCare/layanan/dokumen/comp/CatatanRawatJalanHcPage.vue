<template>
  <div class="bg-white q-pa-sm full-width">
    <div class="row justify-end text-weight-bold q-gutter-sm q-pa-sm print-hide" style="margin-right: 20px; margin-top: 10px;">
      <div style="width: 120px;">
        <q-select
          v-model="store.params.tahunawal"
          label="Tahun Awal"
          :options="options"
          outlined
          dense
          map-options
        />
      </div>
      <div style="width: 120px;">
        <q-select
          v-model="store.params.tahunakhir"
          label="Tahun Akhir"
          outlined
          dense
          :options="options"
          map-options
        />
      </div>
      <div>
        <q-btn
          unelevated
          color="dark"
          round
          size="sm"
          icon="icon-mat-search"
          @click="carikunjungan"
        >
          <q-tooltip class="primary" :offset="[10, 10]">
            Cari
          </q-tooltip>
        </q-btn>
      </div>
      <div>
        <q-btn
          ref="refPrint"
          v-print="printObj"
          unelevated
          color="dark"
          round
          size="sm"
          icon="icon-mat-print"
        >
          <q-tooltip class="primary" :offset="[10, 10]">
            Print
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Area Cetak -->
    <div id="printMeHomeCare" class="q-pa-xs full-width" style="width: 17cm; margin: 0 auto;">
      <KopSurat />
      <IdentitasPage :pasien="props.pasien" />

      <div class="row justify-end text-weight-bold q-gutter-sm" style="margin-right: 20px;">
        <div class="col-1">
          <!-- RM IRJA-2 -->
        </div>
      </div>

      <div class="row justify-center f-20 text-weight-bold q-mb-md">
        CATATAN RAWAT JALAN
      </div>

      <q-separator />

      <div v-if="!store.loading">
        <q-markup-table separator="cell" class="warna-garis" flat bordered dense wrap-cells>
          <thead>
            <tr>
              <th class="text-center" width="7%">TGL JAM</th>
              <th class="text-center" width="7%">PROFESI</th>
              <th class="text-center" width="16%">SUBYEKTIF</th>
              <th class="text-center" width="25%">OBYEKTIF</th>
              <th class="text-center" width="20%">ASESMEN</th>
              <th class="text-center" width="25%">PLANING</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lasoapb, s) in store.items" :key="s">
              <!-- Tanggal Jam -->
              <td class="text-left f-12" width="7%">
                <div>
                  <div>{{ lasoapb?.tgl_kunjungan || lasoapb?.created_at || '-' }}</div>
                  <div class="text-caption text-grey-7">{{ lasoapb?.noreg }}</div>
                </div>
              </td>

              <!-- Profesi -->
              <td class="text-left f-12" width="7%">
                <div>
                  <div>{{ lasoapb?.pegawai?.nama || lasoapb?.dokter?.nama || '-' }}</div>
                  <br v-if="lasoapb?.diagnosakeperawatan?.[0]?.masterperawat?.nama">
                  <div v-if="lasoapb?.diagnosakeperawatan?.[0]?.masterperawat?.nama">
                    {{ lasoapb?.diagnosakeperawatan[0]?.masterperawat?.nama }}
                  </div>
                </div>
              </td>

              <!-- Subyektif -->
              <td class="text-left f-12" width="16%">
                <div v-for="(anamnese, anam) in lasoapb?.anamnesis" :key="anam">
                  <div v-if="anamnese?.rs4">*) Keluhan: {{ anamnese?.rs4 }}</div>
                  <div v-if="anamnese?.riwayatpenyakit">*) RPD: {{ anamnese?.riwayatpenyakit }}</div>
                  <div v-if="anamnese?.riwayatalergi">*) Alergi: {{ anamnese?.riwayatalergi }} <span v-if="anamnese?.keteranganalergi">({{ anamnese?.keteranganalergi }})</span></div>
                  <div v-if="anamnese?.riwayatpengobatan">*) Pengobatan: {{ anamnese?.riwayatpengobatan }}</div>
                  <div v-if="anamnese?.riwayatpenyakitsekarang">*) RPS: {{ anamnese?.riwayatpenyakitsekarang }}</div>
                  <div v-if="anamnese?.riwayatpenyakitkeluarga">*) RPK: {{ anamnese?.riwayatpenyakitkeluarga }}</div>
                  <div v-if="anamnese?.kondisikhusus">*) Kondisi: {{ anamnese?.kondisikhusus }}</div>
                  <div v-if="anamnese?.keteranganscorenyeri">*) Nyeri: {{ anamnese?.keteranganscorenyeri }}</div>
                </div>
              </td>

              <!-- Obyektif -->
              <td class="text-left f-12" width="25%">
                <div v-for="(fisik, f) in lasoapb?.pemeriksaanfisik" :key="f">
                  <div>*) Nadi: {{ fisik?.rs4 || '-' }}, Pernapasan: {{ fisik?.pernapasan || '-' }}, Sistole: {{ fisik?.sistole || '-' }}, Diastole: {{ fisik?.diastole || '-' }}</div>
                  <div>*) Suhu Tubuh: {{ fisik?.suhutubuh || '-' }}, Tinggi Badan: {{ fisik?.tinggibadan || '-' }}, Berat Badan: {{ fisik?.beratbadan || '-' }}, Vas: {{ fisik?.vas || '-' }}</div>
                  <div>*) Status Psikologi: {{ fisik?.statuspsikologis || '-' }}, Sosial Ekonomi: {{ fisik?.sosialekonomi || '-' }}</div>
                  <div>*) Spiritual: {{ fisik?.spiritual || '-' }}, Kesadaran: {{ fisik?.kesadaran || '-' }}</div>
                  <div>*) Status Neurologis: {{ fisik?.statusneurologis || '-' }}</div>
                  <div>*) Muskuloskeletal: {{ fisik?.muakuloskeletal || '-' }}</div>
                </div>
              </td>

              <!-- Asesmen -->
              <td class="text-left f-12" width="20%">
                <div v-for="(diag, d) in lasoapb?.diagnosa" :key="d">
                  <div>*) {{ diag?.masterdiagnosa?.rs1 }} {{ diag?.masterdiagnosa?.rs4 }}</div>
                </div>
                <q-separator v-if="lasoapb?.diagnosakeperawatan?.length" color="dark" class="q-my-xs" />
                <div v-for="(kep, k) in lasoapb?.diagnosakeperawatan" :key="k">
                  <div>*) {{ kep?.kode }} {{ kep?.nama }}</div>
                </div>
              </td>

              <!-- Planing -->
              <td class="text-left f-12" width="25%">
                <div v-if="lasoapb?.laborat?.length">
                  <u><b> Laborat </b></u>
                  <div v-for="(lab, l) in lasoapb?.laborat" :key="l">
                    <div>*) {{ lab?.pemeriksaanlab?.rs2 }} : {{ lab?.rs21 }}</div>
                  </div>
                </div>

                <div v-if="lasoapb?.apotekrajal?.length || lasoapb?.apotekracikanrajal?.length" class="q-mt-xs">
                  <u><b> Obat </b></u>
                  <div v-for="(obat, o) in lasoapb?.apotekrajal" :key="'ob-' + o">
                    <div>*) {{ obat?.obat }}</div>
                  </div>
                  <div v-for="(racik, r) in lasoapb?.apotekracikanrajal" :key="'rc-' + r">
                    <div>*) Racikan: {{ racik?.obat }}</div>
                  </div>
                </div>

                <div v-if="lasoapb?.tindakan?.length" class="q-mt-xs">
                  <u><b> Tindakan </b></u>
                  <div v-for="(tind, t) in lasoapb?.tindakan" :key="t">
                    <div>*) {{ tind?.tindakan }} {{ tind?.keterangan ? '(' + tind?.keterangan + ')' : '' }}</div>
                  </div>
                </div>

                <div v-if="lasoapb?.fisio?.length" class="q-mt-xs">
                  <u><b> Fisioterapi </b></u>
                  <div v-for="(fis, fi) in lasoapb?.fisio" :key="fi">
                    <div>*) {{ fis?.rs2 }}</div>
                  </div>
                </div>

                <div v-if="lasoapb?.edukasi?.length" class="q-mt-xs">
                  <u><b> Edukasi </b></u>
                  <div v-for="(edu, e) in lasoapb?.edukasi" :key="e">
                    <div>*) {{ edu?.rs2 || edu?.materi || 'Edukasi Pasien' }}</div>
                  </div>
                </div>

                <q-separator v-if="cariPlaningKep(lasoapb?.diagnosakeperawatan)?.length" color="dark" class="q-my-xs" />
                <div v-if="cariPlaningKep(lasoapb?.diagnosakeperawatan)?.length">
                  <u><b> Planing Keperawatan </b></u>
                  <div v-for="(plann, p) in cariPlaningKep(lasoapb?.diagnosakeperawatan)" :key="p">
                    <div>*) {{ plann?.masterintervensi?.nama }}</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="!store.items?.length">
              <td colspan="6" class="text-center q-pa-md text-grey-7 italic">
                Belum ada catatan pada rentang tahun ini
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <div v-else class="q-pa-xl text-center">
        <app-loading />
      </div>
    </div>
  </div>
</template>

<script setup>
import KopSurat from 'src/pages/simrs/dokumen/comppoli/KopSurat.vue'
import IdentitasPage from 'src/pages/simrs/dokumen/comppoli/IdentitasPage.vue'
import { ref, onMounted } from 'vue'
import { useDokumenHomeCareStore } from 'src/stores/simrs/homeCare/dokumen'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = useDokumenHomeCareStore()

const options = ref([])
const tahun = new Date().getFullYear()
for (let i = tahun - 4; i <= tahun; i++) {
  options.value.push(i)
}

function cariPlaningKep (val) {
  return val?.flatMap(item => item?.intervensi)?.filter(x => x?.masterintervensi?.group === 'plann') ?? []
}

function carikunjungan () {
  if (props.pasien?.norm) {
    store.init(props.pasien.norm)
  }
}

const printObj = {
  id: 'printMeHomeCare',
  popTitle: 'Catatan Rawat Jalan'
}

onMounted(() => {
  if (props.pasien?.norm) {
    store.init(props.pasien.norm)
  }
})
</script>

<style lang="scss" scoped>
.warna-garis table {
  border-collapse: collapse;
  width: 100%;
}

.warna-garis td,
.warna-garis th {
  border: 1px solid black !important;
}

@media print {
  .print-hide {
    display: none !important;
  }
}
</style>
