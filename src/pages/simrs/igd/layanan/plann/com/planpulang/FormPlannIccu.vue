<template>
  <q-dialog v-model="store.fixediccu">
    <q-card>
      <q-card-section>
        <div class="text-h6">Indikasi Masuk ICCU</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-checkbox v-model="store.form.isi" val="Sindrom Koroner Akut (UAP, NSTEMI, STEMI)"
          label="Sindrom Koroner Akut (UAP, NSTEMI, STEMI)" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Edema Paru Akut" label="Edema Paru Akut" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Gagal jantung akut" label="Gagal jantung akut" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Aritmia maligna atau dengan gangguan hemodinamik"
          label="Aritmia maligna atau dengan gangguan hemodinamik" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Syokkardiogenik : HR > 100 x per mnt, TDS < 100 mmHg"
          label="Syokkardiogenik : HR > 100 x per mnt, TDS < 100 mmHg" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Pasca tindakan Invasive kardiologi, post pemasangan TPM/PPM"
          label="Pasca tindakan Invasive kardiologi, post pemasangan TPM/PPM" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Miokarditis" label="Miokarditis" color="teal" /> <br>
        <q-checkbox v-model="store.form.isi" val="Penyakit lain yang memerlukan pemantauan hemodinamik"
          label="Penyakit lain yang memerlukan pemantauan hemodinamik" color="teal" /> <br>
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

const $q = useQuasar()
const store = usePlannStore();
const options = ref([])

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

  store.fixediccu = false // tutup dialog setelah valid
}
</script>
