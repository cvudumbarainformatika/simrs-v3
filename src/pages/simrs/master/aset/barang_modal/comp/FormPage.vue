<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <div>
      <q-input v-model="store.form.kdaset" outlined dense label="Kode Barang Modal" disable
        :loading="store.loadingSave" />
    </div>
    <div>
      <q-input v-model.number="store.form.namaaset" outlined dense label="Nama Barang Modal"
        :disable="store.loadingSave" :loading="store.loadingSave"
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
    </div>
    <div>
      <q-select v-model="store.form.kd108" label="Kode Rekening 108" outlined emit-value map-options
        option-label="kode108" option-value="kode108" standout="bg-yellow-3" dense :options="store.itemsrek108"
        clearable use-input :rules="[val => !!val || 'Harap Diisi terlebih dahulu']"
        @input-value="(val) => carikode108(val)" @update:model-value="(val) => selected(val)">
        <template #option="scopex">
          <q-item v-bind="scopex.itemProps">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ scopex.opt.kode108 }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.uraian108 }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.kode50 }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.uraian50 }} <br>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              Data Tidak Ditemukan....
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div>
      <q-select v-model="store.form.uraian108" label="Uraian 108" outlined emit-value map-options
        option-label="uraian108" option-value="uraian108" standout="bg-yellow-3" dense :options="store.itemsrek108"
        clearable use-input :rules="[val => !!val || 'Harap Diisi terlebih dahulu']"
        @input-value="(val) => carikode108(val)" @update:model-value="(val) => selectedx(val)">
        <template #option="scopex">
          <q-item v-bind="scopex.itemProps">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ scopex.opt.uraian108 }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.kode108 }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.kode50 }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.uraian50 }} <br>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              Data Tidak Ditemukan....
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div>
      <q-input v-model="store.form.kd50" outlined dense label="Kode Rekening 50" disable
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
    </div>

    <div>
      <q-input v-model="store.form.uraian50" outlined dense label="Uraian Rekening 50" disable
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
    </div>

    <div>
      <q-select v-model="store.form.kdaspak" label="Kode Aspak" outlined emit-value map-options option-label="kode"
        option-value="kode" standout="bg-yellow-3" dense :options="kodeaspak" clearable use-input
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" @filter="filterFnkodeaspak"
        @update:model-value="(val) => selectedkodeaspak(val)">

        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ scope.opt.uraian }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scope.opt.kode }} <br>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              Data Tidak Ditemukan....
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div>
      <q-select v-model="store.form.uraianaspak" label="Uraian Aspak" outlined emit-value map-options
        option-label="uraian" option-value="uraian" standout="bg-yellow-3" dense :options="kodeaspak" clearable
        use-input :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" @filter="filterFnuraianaspak"
        @update:model-value="(val) => selecteduraianaspak(val)">

        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ scope.opt.uraian }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scope.opt.kode }} <br>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              Data Tidak Ditemukan....
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div>
      <q-select v-model="store.form.satuan" label="Satuan" outlined emit-value map-options option-label="nama"
        option-value="nama" standout="bg-yellow-3" dense :options="optsatuan" clearable use-input
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" @filter="filterFnsatuan" />
    </div>


    <q-separator class="q-my-lg" />
    <div class="text-right">
      <q-btn label="Simpan" type="submit" color="primary" :loading="store.loadingSave" />
    </div>
  </q-form>
</template>
<script setup>
import { useMasterBarangModalStore } from 'src/stores/simrs/master/aset/barang_modal/barangmodal';
import { ref } from 'vue';

const store = useMasterBarangModalStore()
const formRef = ref(null)

const props = defineProps({
  kodeaspak: {
    type: Array,
    default: []
  },
  satuan: {
    type: Array,
    default: []
  }
})

const optsatuan = ref(props.satuan)

const kodeaspak = ref(props.kodeaspak)

function simpan() {
  store.simpanData()
}

function selected(val) {

  if (val !== null) {
    const rek108 = store.itemsrek108.find((x) => x.kode108 === val)
    store.form.kd108 = rek108?.kode108
    store.form.uraian108 = rek108?.uraian108
    store.form.kd50 = rek108?.kode50
    store.form.uraian50 = rek108?.uraian50

  }
}

function selectedx(val) {

  if (val !== null) {
    const rek108 = store.itemsrek108.find((x) => x.uraian108 === val)
    store.form.kd108 = rek108?.kode108
    store.form.uraian108 = rek108?.uraian108
    store.form.kd50 = rek108?.kode50
    store.form.uraian50 = rek108?.uraian50

  }
}

function carikode108(val) {
  store.params.q = val
  store.getrek108()
}


const filterFnkodeaspak = (val, update) => {
  update(() => {
    if (!Array.isArray(props.kodeaspak)) {
      kodeaspak.value = []
      return
    }

    if (val === '') {
      kodeaspak.value = props.kodeaspak
      return
    }

    const needle = val.toLowerCase()

    kodeaspak.value = props.kodeaspak.filter(v =>
      v.kode?.toLowerCase().indexOf(needle) > -1
    )
  })
}

function selectedkodeaspak(val) {

  if (val !== null) {
    const koderekening = props?.kodeaspak.find((x) => x.kode === val)
    store.form.uraianaspak = koderekening?.uraian
  }
}

const filterFnuraianaspak = (val, update) => {
  update(() => {
    if (!Array.isArray(props.kodeaspak)) {
      kodeaspak.value = []
      return
    }

    if (val === '') {
      kodeaspak.value = props.kodeaspak
      return
    }

    const needle = val.toLowerCase()

    kodeaspak.value = props.kodeaspak.filter(v =>
      v.uraian?.toLowerCase().indexOf(needle) > -1
    )
  })
}

function selecteduraianaspak(val) {
  if (val !== null) {
    const uraian = props?.kodeaspak.find((x) => x.uraian === val)
    store.form.kdaspak = uraian?.kode
  }
}

const filterFnsatuan = (val, update) => {
  update(() => {
    if (!Array.isArray(props.satuan)) {
      optsatuan.value = []
      return
    }

    if (val === '') {
      optsatuan.value = props.satuan
      return
    }

    const needle = val.toLowerCase()

    optsatuan.value = props.satuan.filter(v =>
      v.nama?.toLowerCase().indexOf(needle) > -1
    )
  })
}


</script>
