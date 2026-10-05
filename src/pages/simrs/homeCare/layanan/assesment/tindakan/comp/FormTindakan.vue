<script setup>
import { useDiagnosaHomeCare } from 'src/stores/simrs/homeCare/diagnosa'
import { onMounted, ref } from 'vue'
import AutocompleteNakesMulti from './AutocompleteNakesMulti.vue'

const store = useDiagnosaHomeCare()

const options = ref([])
const formmRef = ref(null)
const pelaksanaSatuRef = ref(null)
const pelaksanaDuaRef = ref(null)
const inpQtyRef = ref(null)

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

onMounted(async () => {
  if (!store.listPetugas?.length) {
    await store.getAllPetugas()
  }
  if (!store.listTindakan?.length) {
    await store.getTindakanDropdown()
  }
  options.value = store.listTindakan
})

const onSubmit = () => {
  store.saveTindakan(props.pasien)
    .then(() => {
      store.searchtindakan = ''
      store.initReset('Tindakan Medik')
      formmRef.value?.reset()
      formmRef.value?.resetValidation()

      pelaksanaSatuRef?.value?.refAutocomplete?.reset?.()
      pelaksanaDuaRef?.value?.refAutocomplete?.reset?.()
    })
}

function updateSearchTindakan (val) {
  store.setKdTindakan(val).then(() => {
    inpQtyRef.value?.focus()
  })
}

function filterFn (val, update, abort) {
  if (val?.length < 1) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    const arr = store.listTindakan || []
    const filter = ['kdtindakan', 'tindakan', 'icd9']
    const multiFilter = (data = [], filterKeys = [], value = '') =>
      data.filter((item) => filterKeys.some(
        (key) =>
          item[key]?.toString()?.toLowerCase()?.includes(value.toLowerCase()) &&
          item[key]
      ))
    options.value = multiFilter(arr, filter, needle)
  })
}

</script>

<template>
  <div class="fit column">
    <div class="col full-height scroll">
      <q-card flat>
        <q-form ref="formmRef" class="" @submit="onSubmit">
          <q-card-section class="row q-pa-md q-col-gutter-sm">
            <div class="col-12 q-mb-sm">
              <div class="flex q-gutter-x-md items-center">
                <div class="text-weight-bold">Nota Tindakan :</div>
                <q-select
                  v-model="store.notaTindakan"
                  outlined
                  standout="bg-yellow-3"
                  bg-color="white"
                  dense
                  :options="store.notaTindakans"
                  :display-value="`${store.notaTindakan === '' || store.notaTindakan === 'BARU' ? 'BARU' : store.notaTindakan}`"
                  style="min-width: 200px;"
                />
              </div>
            </div>
            <div class="col-12 q-mb-sm">
              <q-select
                v-model="store.searchtindakan"
                use-input
                hide-selected
                fill-input
                outlined
                standout="bg-yellow-3"
                dense
                emit-value
                map-options
                option-value="kdtindakan"
                :option-label="opt => Object(opt) === opt && 'tindakan' in opt ? opt.kdtindakan + ' ~ ' + opt.tindakan + (opt.icd9 ? ' -- ICD9 -- ' + opt.icd9 : '') : ' Cari Tindakan '"
                input-debounce="0"
                :options="options"
                label="Cari Tindakan"
                @filter="filterFn"
                @update:model-value="(val) => updateSearchTindakan(val)"
              >
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
              <div class="flex no-wrap q-gutter-x-sm">
                <div>Tindakan </div>
                <div>: </div>
                <div class="text-accent text-weight-bold">
                  {{ store.formtindakan?.tindakan }}
                </div>
              </div>
            </div>

            <div class="col-9">
              <q-input
                v-model="store.formtindakan.tarif"
                label="Biaya (Otomatis)"
                dense
                outlined
                standout="bg-yellow-3"
                :rules="[val => !!val || 'Harus diisi']"
                hide-bottom-space
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                ref="inpQtyRef"
                v-model="store.formtindakan.jmltindakan"
                label="Qty"
                dense
                outlined
                standout="bg-yellow-3"
                :rules="[
                  val => !!val || 'Harus diisi',
                  val => !isNaN(val) || 'Harus pakai Nomor',
                ]"
                hide-bottom-space
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="store.formtindakan.keterangan"
                label="Keterangan"
                autogrow
                outlined
                standout="bg-yellow-3"
                hide-bottom-space
              />
            </div>
            <div class="col-12">
              <q-separator />
            </div>

            <AutocompleteNakesMulti
              ref="pelaksanaSatuRef"
              v-model="store.formtindakan.pelaksanaSatu"
              label="Pelaksana Satu"
              placeholder="Pelaksana Satu"
              class="col-12"
              autocomplete="nama"
              option-value="kdpegsimrs"
              option-label="nama"
              map-options
              emit-value
              use-chips
              :model="store.formtindakan.pelaksanaSatu"
              :source="store.listPetugas"
              @update:model-value="(val) => {
                store.formtindakan.pelaksanaSatu = val
              }"
              :rules="[val => !!val?.length || 'Harap diisi']"
            />
            <AutocompleteNakesMulti
              ref="pelaksanaDuaRef"
              v-model="store.formtindakan.pelaksanaDua"
              label="Pelaksana Dua"
              placeholder="Pelaksana Dua"
              class="col-12"
              autocomplete="nama"
              option-value="kdpegsimrs"
              option-label="nama"
              map-options
              emit-value
              use-chips
              :model="store.formtindakan.pelaksanaDua"
              :source="store.listPetugas"
              @update:model-value="(val) => {
                store.formtindakan.pelaksanaDua = val
              }"
            />
          </q-card-section>
          <q-separator />
          <q-card-section align="right">
            <q-btn
              label="Simpan Tindakan"
              color="primary"
              type="submit"
              :loading="store.loadingFormTindakan"
              :disable="store.loadingFormTindakan"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>
