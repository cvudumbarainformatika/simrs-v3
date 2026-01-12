<template>
  <q-dialog position="right" @hide="emits('onHide')" @show="onShow">
    <q-card class="column full-height" style="min-width: 50vw;">
      <q-bar class="col-auto">
        <q-icon name="icon-mat-edit_document" />
        <div class="f-12">
          Notasi DPJP
        </div>

        <q-space />

        <q-btn dense flat icon="icon-mat-close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-separator />

      <q-card-section class="col full-height scroll">
        <div class="row q-col-gutter-sm">
          <div class="col-auto">
            <AppAvatarPasien :pasien="pasien" width="100px" />
          </div>

          <div class="col full-width">
            <div class="row full-width">
              <div style="width:15%" class="text-bold">Nama </div>
              <div> : {{ pasien?.nama_panggil }}</div>
            </div>
            <div class="row full-width">
              <div style="width:15%" class="text-bold">Noreg </div>
              <div> : {{ pasien?.noreg }}</div>
            </div>
            <div class="row full-width">
              <div style="width:15%" class="text-bold">NO. RM </div>
              <div> : {{ pasien?.norm }}</div>
            </div>
            <div class="row full-width">
              <div style="width:15%" class="text-bold">Usia </div>
              <div> : {{ pasien?.usia }}</div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-sm"></q-separator>
        <q-form class="row full-width" @submit.prevent="onSubmit">
          <q-input v-model="form.notasi" outlined stack-label type="textarea" standout="bg-yellow-3" class="full-width"
            :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" :lazy-rules="true" rows="10" hide-bottom-space />
          <div class="full-width">
            <q-separator class="col-auto q-my-lg"></q-separator>
            <q-btn :loading="loading" :disable="loading" color="primary" size="md" no-caps type="submit">Simpan
              Notasi</q-btn>
          </div>
        </q-form>

      </q-card-section>
      <!-- <div class="col-auto">
        <q-separator />
        Bottom
      </div> -->
    </q-card>
  </q-dialog>
</template>

<script setup>
// import { date } from 'quasar'
// eslint-disable-next-line no-unused-vars
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { api } from 'boot/axios'
import { notifSuccessVue } from 'src/modules/utils'

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  },
})

const emits = defineEmits(['onHide', 'onClick', 'exit'])

const form = ref({
  notasi: '',
  noreg: props.pasien?.noreg,
  norm: props.pasien?.norm
})

const loading = ref(false)


const onShow = () => {
  // console.log('onShow', props.store.notasis)
  // console.log('onShow item', props.item)

  initForm()

}

const notasix = computed(() => {
  return props.store.notasis.filter(x => x?.cppt_id === props.item.id) || []
})

const initForm = () => {
  // cari notasis berdasarkan id cppt
  const notasis = props.store.notasis.filter(item => item.cppt_id === props.item.id) || []
  if (notasis.length > 0) {
    form.value.notasi = notasis[0].notasi
    form.value.cppt_id = notasis[0].cppt_id
    form.value.noreg = notasis[0].noreg
    form.value.norm = notasis[0].norm
  }

  console.log('form', form.value);



}

const onSubmit = async () => {
  form.value.cppt_id = props.item.id
  // console.log('onSubmit', form.value)

  loading.value = true

  const formData = form.value

  try {
    const resp = await api.post('v1/simrs/ranap/layanan/cppt/simpanNotasi', formData)
    console.log('resp notasi', resp);

    if (resp.status === 200) {
      props.store.getNotasiDpjp(props?.pasien?.noreg)
    }

    notifSuccessVue('Notasi Berhasil disimpan')
    emits('exit')

  } catch (error) {
    console.log('error simpan notasi', error);

  } finally {
    resetForm()
    loading.value = false
  }
}

const resetForm = () => {
  form.value.notasi = ''
}
</script>
