<template>
  <!-- <pre>{{ props.barang108s }}</pre> -->
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">

    <div>
      <q-input v-model.number="store.form.namaaset" outlined dense label="Nama Barang Modal"
        :disable="store.loadingSave" :loading="store.loadingSave"
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
    </div>
    <div>
      <q-select v-model="store.form.kode108" label="Kode Rekening 108" outlined emit-value map-options
        option-label="kode" option-value="kode" standout="bg-yellow-3" dense transition-show="flip-up"
        transition-hide="flip-down" :options="options" clearable use-input
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" @filter="filterFnx"
        @update:model-value="(val) => selectedx(val)">
        <template #option="scopex">
          <q-item v-bind="scopex.itemProps">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ scopex.opt.uraian }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.kode }} <br>
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
      <q-select v-model="store.form.uraian108" label="Uraian 108" outlined emit-value map-options option-label="uraian"
        option-value="uraian" standout="bg-yellow-3" dense transition-show="flip-up" transition-hide="flip-down"
        :options="options" clearable use-input :rules="[val => !!val || 'Harap Diisi terlebih dahulu']"
        @filter="filterFn" @update:model-value="(val) => selected(val)">
        <template #option="scopex">
          <q-item v-bind="scopex.itemProps">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ scopex.opt.uraian }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.kode }} <br>
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
      <q-select v-model="store.form.kode50" label="Kode Rekening 50" outlined emit-value map-options option-label="kode"
        option-value="kode" standout="bg-yellow-3" dense transition-show="flip-up" transition-hide="flip-down"
        :options="options" clearable use-input :rules="[val => !!val || 'Harap Diisi terlebih dahulu']"
        @filter="filterFnx" @update:model-value="(val) => selectedx(val)">
        <template #option="scopex">
          <q-item v-bind="scopex.itemProps">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ scopex.opt.uraian }} <br>
              </q-item-label>
              <q-item-label caption class="text-italic">
                {{ scopex.opt.kode }} <br>
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
  barang108s: {
    type: Array,
    default: []
  }
})

const options = ref([props.barang108s])

function simpan() {
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}

function selected(val) {

  if (val !== null) {
    const uraian108 = props.barang108s.find((x) => x.uraian === val)
    store.form.kode108 = uraian108?.kode

  }
}

function selectedx(val) {
  if (val !== null) {
    const koderekening = props?.barang108s.find((x) => x.kode === val)
    store.form.uraian108 = koderekening?.uraian
  }
}

const filterFn = (val, update) => {
  update(() => {
    if (!Array.isArray(props.barang108s)) {
      options.value = []
      return
    }

    if (val === '') {
      options.value = props.barang108s
      return
    }

    const needle = val.toLowerCase()

    options.value = props.barang108s.filter(v =>
      v.uraian?.toLowerCase().indexOf(needle) > -1
      // || v.kode?.toLowerCase().includes(needle)
    )
    // store.form.kode108 = options.value[0].kode
    // console.log('options', options.value)
  })
}

const filterFnx = (val, update) => {
  update(() => {
    if (!Array.isArray(props.barang108s)) {
      options.value = []
      return
    }

    if (val === '') {
      options.value = props.barang108s
      return
    }

    const needle = val.toLowerCase()

    options.value = props.barang108s.filter(v =>
      v.kode?.toLowerCase().indexOf(needle) > -1
      // || v.kode?.toLowerCase().includes(needle)
    )
    // store.form.kode108 = options.value[0].kode
    // console.log('options', options.value)
  })
}

</script>
