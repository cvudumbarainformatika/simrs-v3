<template>
  <q-dialog v-model="store.dialog" persistent :backdrop-filter="backdropFilter" transition-show="flip-down"
    transition-hide="flip-up">
    <q-card>
      <q-form ref="refForm" @submit="onSubmit">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Form Data Peminjaman Arsip</div>
          <div class="text-subtitle2 text-weight-bold text-center">No Peminjaman :
            {{ store.form.nopeminjaman }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section align="center" class="full-height full-width ">

          <div>
            <div class="row">
              <div class="col-12">
                <q-select v-model="store.form.peminjam" label="Nama Peminjam" outlined dense
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" :options="store.itemspegawai"
                  option-label="nama" option-value="nik" emit-value map-options use-input
                  :loading="store.loadingpegawai" @input-value="store.caripegawai" @update:model-value="(val) => {
                    carijabatan(val)
                  }">
                  <template #append>
                    <q-icon v-if="store.form.peminjam" name="icon-mat-cancel" class="cursor-pointer"
                      @click.stop.prevent="store.form.peminjam = null" />
                  </template>

                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input v-model="store.form.jabatan" label="Jabatan" outlined dense
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" :disable="true" />
              </div>
            </div>
            <div class="row"
              v-if="appstore?.user?.pegawai?.kdarteri === '' || appstore?.user?.pegawai?.kdarteri === null">
              <div class="col-12">
                <q-select v-model="store.form.unitpengolah" outlined dense label="Masukkan Unit Pengelolah" clearable
                  debounce="300" :loading="store.loading" option-label="nama" option-value="kode" map-options
                  :error="isUnitpengolahInvalid" error-message="Unit Pengelolah wajib diisi" :options="organisasi"
                  @update:model-value="(val) => {
                    store.form.unitpengolah = val.kode
                  }" />
              </div>
            </div>
            <div class="row q-mt-md q-mb-md">
              <div class="col-12">
                <app-input-date-human :model="store.tanggal" label="Tanggal Peminjaman" outlined @db-model="setFrom"
                  @set-display="setToFromDisp" :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
              </div>
            </div>
            <div class="row q-mt-md q-mb-md">
              <div class="col-12">
                <app-input-date-human :model="store.rencanakembali" label="Rencana Pengembalian" outlined
                  @db-model="setFromx" @set-display="setToFromDispx"
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input type="textarea" v-model="store.form.keterangan" label="Keperlua Peminjaman" outlined
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup color="dark" label="Cancel" @click="store.initreset()" />
          <q-btn color="red" label="Simpan" tooltip="Save" type="submit" tip :loading="store.loadingForm" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

</template>
<script setup>
import { useAplikasiStore } from 'src/stores/app/aplikasi';
import { useUnitPengelolaharsippeminjamanStore } from 'src/stores/simrs/unitpengelolaarsip/peminjamanarsip';
import { computed, onMounted, ref } from 'vue';

const store = useUnitPengelolaharsippeminjamanStore()
const appstore = useAplikasiStore()
const props = defineProps({
  kelasifikasi: {
    type: Array,
    default: () => []
  },
  organisasi: {
    type: Array,
    default: () => []
  },
  pegawai: {
    type: Array,
    default: () => []
  },
})

const isUnitpengolahInvalid = computed(() => {
  const kdarteri = appstore?.user?.pegawai?.kdarteri
  return (!kdarteri || kdarteri === '') && !store.form.unitpengolah
})



function setFrom(val) {
  store.form.tanggal = val
}

function setToFromDisp(vaal) {
  store.tanggal = vaal
}

function setFromx(val) {
  store.form.rencanakembali = val
}

function setToFromDispx(vaal) {
  store.rencanakembali = vaal
}

function onSubmit() {
  store.saveData()
}

const backdropFilter = ref('blur(4px)')
const options = ref(props.pegawai)

function filterFn(val, update) {

  if (val === "") {
    update(() => {
      options.value = props.pegawai
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase();

    options.value = props.pegawai.filter(
      (v) =>
        v.nama.toString().toLowerCase().indexOf(needle) > -1 ||
        v.nip.toString().toLowerCase().indexOf(needle) > -1
    );
  });
}

function carijabatan(val) {

  const xxx = store.itemspegawai.find(x => x.nik === val)
  store.form.jabatan = xxx.relasi_jabatan?.jabatan
  store.form.kd_jabatan = xxx.jabatan
}

onMounted(() => {
  store.loadingprint = false
  store.form.unitpengolah = appstore?.user?.pegawai?.kdarteri
})
</script>
