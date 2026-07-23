<template>
  <q-dialog v-model="store.fixednicu">
    <q-card>
      <q-card-section>
        <div class="text-h6">Indikasi Masuk NICU</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        Pasien yang membutuhkan perawatan NICU adalah semua bayi yang memerlukan monitor/observasi ketat <br>
        <q-checkbox v-model="store.form.isi" val="Memerlukan O2 > 60%" label="Memerlukan O2 > 60%" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Memerlukan CPAP/Ventilator" label="Memerlukan CPAP/Ventilator"
          color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="NKB < 32 mg, BBL < 1500 gr" label="NKB < 32 mg, BBL < 1500 gr"
          color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Asfiksia berat, syok, sering apnoe atau kejang, gangguan perdarahan"
          label="Asfiksia berat, syok, sering apnoe atau kejang, gangguan perdarahan" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Mengalami masalah metabolic" label="Mengalami masalah metabolic"
          color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi dengan kelainan congenital berat"
          label="Bayi dengan kelainan congenital berat" color="teal" /> <br>

        Kriteria pasien yang membutuhkan perawatan intermediate :
        <q-checkbox v-model="store.form.isi" val="Bayi yang baru keluar dari NICU, masih perlu monitor dan observasi"
          label="Bayi yang baru keluar dari NICU, masih perlu monitor dan observasi" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi yang memerlukan O2 < 60%" label="Bayi yang memerlukan O2 < 60%"
          color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="NKB 32-34 mg, kondisi stabil, BBL > 1500 gr"
          label="NKB 32-34 mg, kondisi stabil, BBL > 1500 gr" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="NKB 34-36 mg, kondisi stabil, reflek hisap lemah"
          label="NKB 34-36 mg, kondisi stabil, reflek hisap lemah" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi yang dipuasakan atau EKN" label="Bayi yang dipuasakan atau EKN"
          color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi yang memerlukan tranfusi tukar"
          label="Bayi yang memerlukan tranfusi tukar" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi yang sering muntah" label="Bayi yang sering muntah"
          color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi dengan kelainan kronik (CLD)"
          label="Bayi dengan kelainan kronik (CLD)" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi"
          val="Bayi yang memerlukan foto terapi dengan masalah lain : dehidrasi, minum personde"
          label="Bayi yang memerlukan foto terapi dengan masalah lain : dehidrasi, minum personde" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi dengan kelainan congenital ringan, missal celah bibir"
          label="Bayi dengan kelainan congenital ringan, missal celah bibir" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi dengan ibu DM" label="Bayi dengan ibu DM" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Bayi dengan asfiksia sesdang, nilai APGAR pada 5 menit < 7"
          label="Bayi dengan asfiksia sesdang, nilai APGAR pada 5 menit < 7" color="teal" /> <br>
        <q-select label="Dokter Penerima" :options="options" v-model="store.form.dokterpenerima" outlined dense
          option-label="nama" option-value="kdpegsimrs" clearable use-input @filter="filterOptions" emit-value
          map-options lazy-rules :rules="[
            val => !!val || 'Dokter penerima wajib dipilih'
          ]" />
      </q-card-section>
      <q-separator />

      <q-card-actions align="right">
        <q-btn label="CLOSE" color="red" v-close-popup />
        <q-btn label="SIMPAN" color="primary" @click="simpan" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { usePlannStore } from 'src/stores/simrs/igd/plann';
import { ref } from 'vue';

const store = usePlannStore()
const options = ref([])
const $q = useQuasar()

function updateSelection(val) {
  store.setForm('isi', val.join(', '))
}

function updateSelectionx(val) {
  store.setForm('isix', val.join(', '))
}

async function filterOptions(val, update) {
  if (!val) {
    update(() => {
      options.value = []
    })
    return
  }
  const params = {
    params: {
      q: val
    }
  }
  // console.log('q :', val)
  const resp = await api.get('/v1/settings/appmenu/cari_dokter', params)
  console.log('cari', resp)
  update(
    () => (options.value = resp.data),
    ref => {
      if (val !== '' && ref.options?.length) {
        ref.setOptionIndex(-1)
        ref.moveOptionSelection(1, true)
      }
    }
  )
}

const simpan = () => {
  if (!store.form.dokterpenerima) {
    $q.notify({
      type: 'negative',
      message: 'Dokter penerima wajib dipilih',
      position: 'top-right'
    })
    return
  }

  // proses simpan...

  store.fixednicu = false // tutup dialog setelah valid
}
</script>
