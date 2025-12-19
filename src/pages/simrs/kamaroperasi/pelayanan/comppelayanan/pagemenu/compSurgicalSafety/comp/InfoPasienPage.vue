<template>
  <div class="row q-pa-sm">
    <div class="col-4 bg-blue-2">
      <div class="q-pa-sm">
        <div class="row">{{ pasien?.nama }}</div>
        <div class="row">{{ pasien?.usia }} / {{ pasien?.kelamin }}</div>
        <div class="row">{{ pasien?.ruangan }}</div>
      </div>
    </div>
    <div class="col-4">
      <div class="row">
        <div class="col-auto" style="width: 25%;">Diagnosa</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">{{ memoDiag(pasien?.manymemo) }}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-auto" style="width: 25%;">Tindakan</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">{{ tindakanOp(pasien?.manytindakanop) }}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-auto" style="width: 25%;">Operator</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">{{ getNakesNya(store.form?.dokter_operator)?.nama ?? 'belum di isi' }}
        </div>
      </div>
      <div class="row no-wrap">
        <div class="col-auto" style="width: 25%;">Anastesi</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">{{ getNakesNya(store.form?.dokter_anastesi)?.nama ?? 'belum di isi' }}
        </div>
      </div>
      <div class="row no-wrap">
        <div class="col-auto" style="width: 25%;">Instrumen</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">{{ getNakesNya(store.form?.perawat_instrumen)?.nama ?? 'belum di isi'
          }}</div>
      </div>
    </div>
    <div class="col-4">
      <div class="row">
        <div class="col-auto" style="width: 25%;">Tanggal</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">{{ dateFullFormat(pasien?.manytindakanop[0]?.laporanoperasi?.rs3) }}
        </div>
      </div>
      <div class="row">
        <div class="col-auto" style="width: 25%;">Jam</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">{{ formatJam(pasien?.manytindakanop[0]?.laporanoperasi?.rs3) }}
        </div>
      </div>
      <div class="row no-wrap">
        <div class="col-auto" style="width: 25%;">Asisten</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">
          <app-autocomplete v-model="store.form.asisten_1" valid label="Pilih Asisten" :source="store.nakes"
            option-label="nama" option-value="kdpegsimrs" outlined clearable />
        </div>
      </div>
      <div class="row no-wrap">
        <div class="col-auto" style="width: 25%;">Asisten</div>
        <div class="col-auto" style="width: 5%;">:</div>
        <div class="col-auto" style="width: 70%;">
          <app-autocomplete v-model="store.form.asisten_2" valid label="Pilih Asisten" :source="store.nakes"
            option-label="nama" option-value="kdpegsimrs" outlined clearable />
        </div>
      </div>
    </div>
  </div>
  <!-- {{ pasien }} -->
</template>
<script setup>
import { dateFullFormat, formatJam } from 'src/modules/formatter'
import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

const store = useSurgicalSafetyStore()
function getNakesNya (val) {
  return store.nakes?.find(i => i.kdpegsimrs == val)
}
function memoDiag (val) {
  if (val.length > 1) {
    const arr = val?.find(x => x.kdruang != "POL014")
    return arr?.diagnosa
  } else {
    if (val?.length > 0) {
      return val[0]?.diagnosa
    } else return "-"
  }
}
function tindakanOp (val) {
  const tind = val?.flatMap(x => x?.mastertindakanoperasi?.rs2)?.join(", ")
  // console.log('tind', tind)
  return tind
}
</script>
