<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <!-- <pre>{{ props.koderek50 }}</pre> -->
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
      <q-select v-model="store.form.kd108" label="Kode Rekening 108" outlined emit-value map-options option-label="kode"
        option-value="kode" standout="bg-yellow-3" dense :options="options" clearable use-input
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
        option-value="uraian" standout="bg-yellow-3" dense :options="options" clearable use-input
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" @filter="filterFn"
        @update:model-value="(val) => selected(val)">
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
      <q-select v-model="store.form.kd50" label="Kode Rekening 50" outlined emit-value map-options option-label="kode"
        option-value="kode" standout="bg-yellow-3" dense :options="koderek50" clearable use-input
        :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" @filter="filterFn50"
        @update:model-value="(val) => selected50(val)">

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
      <q-select v-model="store.form.uraian50" label="Uraian Rekening 50" outlined emit-value map-options
        option-label="uraian" option-value="uraian" standout="bg-yellow-3" dense :options="koderek50" clearable
        use-input :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" @filter="filterFn50uraian"
        @update:model-value="(val) => selected50uraian(val)">

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
  },
  koderek50: {
    type: Array,
    default: []
  },
  kodeaspak: {
    type: Array,
    default: []
  }
})

const options = ref([props.barang108s])
const koderek50 = ref([props.koderek50])
const kodeaspak = ref(props.kodeaspak)

function simpan() {
  store.simpanData()
}

function selected(val) {

  if (val !== null) {
    const uraian108 = props.barang108s.find((x) => x.uraian === val)
    store.form.kd108 = uraian108?.kode

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
    )
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
    )
  })
}

const filterFn50 = (val, update) => {
  update(() => {
    if (!Array.isArray(props.koderek50)) {
      koderek50.value = []
      return
    }

    if (val === '') {
      koderek50.value = props.koderek50
      return
    }

    const needle = val.toLowerCase()

    koderek50.value = props.koderek50.filter(v =>
      v.kode?.toLowerCase().indexOf(needle) > -1
    )
  })
}

function selected50(val) {
  console.log('val', val)
  if (val !== null) {
    const koderekening = props?.koderek50.find((x) => x.kode === val)
    store.form.uraian50 = koderekening?.uraian
  }
}

const filterFn50uraian = (val, update) => {

  update(() => {
    if (!Array.isArray(props.koderek50)) {
      koderek50.value = []
      return
    }

    if (val === '') {
      koderek50.value = props.koderek50
      return
    }

    const needle = val.toLowerCase()

    koderek50.value = props.koderek50.filter(v =>
      v.uraian?.toLowerCase().indexOf(needle) > -1
    )
  })
}

function selected50uraian(val) {
  if (val !== null) {
    const uraian = props?.koderek50.find((x) => x.uraian === val)
    store.form.kd50 = uraian?.kode
  }
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


</script>
