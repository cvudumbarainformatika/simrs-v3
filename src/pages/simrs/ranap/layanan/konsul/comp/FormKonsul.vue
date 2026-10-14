<template>
  <div class="fit column scroll">
    <q-form ref="formRef" @submit="onSubmit" class="q-pa-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div><b>Mohon bantuan dokter : </b></div>
          <app-autocomplete-new
            ref="refDokter"
            :model="store.form.kddokterkonsul"
            label="Dokter"
            autocomplete="nama"
            option-value="kdpegsimrs"
            option-label="nama"
            outlined
            :source="store.dokters"
            @on-select="onSelectDokter"
            @clear="store.form.kddokterkonsul = null"
          />
          <div class="q-mt-lg">
            <b>Untuk : </b>
          </div>
          <app-autocomplete-new
            ref="refUntuk"
            :model="store.form.kduntuk"
            label="untuk"
            autocomplete="label"
            option-value="value"
            option-label="label"
            outlined
            :source="store.untuks"
            @on-select="(val) => {
              store.form.kduntuk = val
              store.form.ketuntuk = store.untuks?.find(e => e?.value === val)?.label
            }"
            @clear="store.form.kduntuk = null"
          />
          <q-input v-model="store.form.permintaan" type="textarea" outlined standout="bg-yellow-3" rows="8" />
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div class="row full-width justify-end">
        <q-btn
          :loading="store.loadingOrder"
          :disable="store.loadingOrder"
          label="Kirim Permintaan"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useKonsulRanapStore } from 'src/stores/simrs/ranap/konsul'
import { notifErrVue } from 'src/modules/utils'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const $q = useQuasar()
const auth = useAplikasiStore()
const store = useKonsulRanapStore()

const formRef = ref(null)
const refDokter = ref(null)
const refUntuk = ref(null)

const dokterPengaju = computed(() => {
  const loginDokter = auth.user?.pegawai?.kdpegsimrs
  const dpjp = props.pasien?.kodedokter || props.pasien?.kddokter
  return {
    loginDokter,
    dpjp
  }
})

function checkDokterSama(kdDokter) {
  if (!kdDokter) return false
  const { loginDokter, dpjp } = dokterPengaju.value
  if (loginDokter && kdDokter === loginDokter) {
    return true
  }
  if (dpjp && kdDokter === dpjp) {
    return true
  }
  return false
}

function alertDokterSama() {
  $q.dialog({
    html: true,
    title: '<div class="text-center q-pt-sm">' +
           '  <div class="q-mb-md flex flex-center">' +
           '    <div style="width: 76px; height: 76px; border-radius: 50%; border: 4px solid #f8bb86; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(248, 187, 134, 0.4);">' +
           '      <span style="font-size: 44px; color: #f8bb86; font-weight: 900; line-height: 1; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">!</span>' +
           '    </div>' +
           '  </div>' +
           '  <div class="text-h5 text-weight-bolder text-dark">Mohon Maaf</div>' +
           '</div>',
    message: '<div class="text-center text-subtitle1 text-grey-8 q-mt-sm q-px-sm" style="line-height: 1.6; font-size: 15px;">' +
             '  dipastikan Dokter tujuan Konsul Berbeda dengan yg Mengajukan Konsulan ...' +
             '</div>',
    ok: {
      label: 'OK',
      unelevated: true,
      color: 'warning',
      textColor: 'white',
      class: 'q-px-xl text-weight-bold text-body1',
      style: 'margin: 10px auto 8px auto; display: block; border-radius: 8px; background-color: #f8bb86 !important; min-width: 120px;'
    },
    persistent: true
  })
}

function onSelectDokter(val) {
  if (!val) {
    store.form.kddokterkonsul = null
    return
  }

  if (checkDokterSama(val)) {
    store.form.kddokterkonsul = null
    nextTick(() => {
      store.form.kddokterkonsul = null
    })
    alertDokterSama()
    return
  }

  store.form.kddokterkonsul = val
}

function onSubmit() {
  if (!store.form.kddokterkonsul) {
    return notifErrVue('Pilih dokter tujuan konsul terlebih dahulu')
  }

  if (checkDokterSama(store.form.kddokterkonsul)) {
    store.form.kddokterkonsul = null
    alertDokterSama()
    return
  }

  store.saveData(props.pasien)
    .then(() => {
      formRef.value?.resetValidation()
    })
}
</script>
