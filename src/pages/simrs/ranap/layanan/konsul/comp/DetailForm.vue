<template>
  <div class="fit column scroll">
    <div class="col-auto header">
      <div class=" row justify-between items-center q-pa-sm bg-white">
        <div class="kiri">
          <q-btn icon="icon-mat-arrow_back" flat dense size="md" color="dark" @click="emits('toList')">
            <q-tooltip>
              Kembali Ke List
            </q-tooltip>
          </q-btn>
        </div>
        <div class="kanan text-right text-bold">
          <div>{{ pasien?.nama }}</div>
          <div>{{ pasien?.norm }}</div>
        </div>
      </div>
    </div>

    <div class="col full-height bg-grey-1 scroll">
      <div class="q-pa-lg">
        <div class="text-h6 text-weight-light">
          [Konsultasi Dokter] Kunjungan No. <span class="text-primary">{{ pasien?.rs1 }}</span>
        </div>
        <div class="f-20 text-weight-light">
          {{ item?.ketuntuk }}
        </div>

        <div class="q-mt-lg">
          <div>Dengan Hormat,</div>
          <div>Mohon Bantuan Dokter <b>{{ namaPetugas(item?.kddokterkonsul) }}</b>, untuk konsultasi Masalah medik saat
            ini</div>
          <div>{{ item?.permintaan }}</div>

          <div class="q-mt-lg">
            Terimakasih Atas Kerjasamanya
          </div>

          <q-form v-if="cekYgMenjawab(item)" ref="formRef" class="q-mt-lg" @submit="onSubmit">
            <q-badge class="q-px-md q-py-sm" :color="item?.user_jawab !== props?.auth ? 'orange-9' : 'primary'"
              :text-color="item?.user_jawab !== props?.auth ? 'white' : 'white'">
              {{ item?.user_jawab !== props?.auth
                ? 'Jawaban Ini Belum Terverifikasi Dokter Konsulan'
                : 'Sudah Terverifikasi' }}
            </q-badge>
            <q-input outlined standout="bg-yellow-3" v-model="form.jawaban" label="" type="textarea" rows="10" />

            <div class="text-right q-mt-lg q-gutter-md">
              <q-btn color="dark" label="Kembali" @click="emits('toList')" />
              <q-btn :loading="loadingSave" :disable="loadingSave" color="primary"
                :label="item?.user_jawab !== props?.auth ? 'Simpan Jawaban' : 'Ubah Jawaban'" type="submit" />
            </div>
          </q-form>

          <div v-else class="q-mt-lg">
            <div class="text-weight-bold">
              Jawaban :
            </div>
            <span v-html="getNewLine(item?.jawaban) || 'Belum Ada Jawaban'" />

            <div class="q-mt-lg">
              <q-badge class="q-px-md">
                Jawaban Sudah Terverif Oleh Dokter Konsulan
              </q-badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useKonsulRanapStore } from 'src/stores/simrs/ranap/konsul'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { api } from 'src/boot/axios'
// eslint-disable-next-line no-unused-vars
import { notifSuccess } from 'src/modules/utils'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  item: {
    type: Object,
    default: null
  },
  auth: {
    type: String,
    default: null
  }
})

const emits = defineEmits(['toList'])

const store = useKonsulRanapStore()
const kunjunganRanap = usePengunjungRanapStore()
const formRef = ref(null)
const form = ref({
  jawaban: 'Dengan Hormat, ' + '\n' + 'Sesuai Permintaan konsultasi pada Pemeriksaan pasien, kami dapati saat ini' + '\n' + '\n' + '\n' + 'Saran Tindakan medik / Pengobatan : ' + '\n'
})
const loadingSave = ref(false)

function namaPetugas(item) {
  // console.log('item', item)
  const petugas = store.dokters?.find(x => x.kdpegsimrs === item)?.nama ?? null
  return petugas
}

onMounted(() => {
  console.log('item', props?.item)
  form.value.jawaban = props?.item?.jawaban ?? 'Dengan Hormat, ' + '\n' + 'Sesuai Permintaan konsultasi pada Pemeriksaan pasien, kami dapati saat ini' + '\n' + '\n' + '\n' + 'Saran Tindakan medik / Pengobatan : ' + '\n'

  if (props?.auth === props?.item?.kddokterkonsul) {
    Promise.all([
      updateFlagRanap(props?.item)
    ])
  }
})

function cekYgMenjawab(item) {
  let open = false
  console.log('cekYgMenjawb', item);
  console.log('auth', props.auth);


  const nakesYnMinta = item?.nakesminta?.kdgroupnakes ?? null
  const dokterUmum = item?.nakesminta?.kdgroupnakes === '1' && item?.nakesminta?.statusspesialis === ''
  const ygJwbPerawat = (item?.kddokterkonsul !== item?.user_jawab)
  if (item?.kddokterkonsul === props?.auth) { // jika akun dokter konsulnya maka... jawaban terbuka
    // tapi jika dokter sudah memverif

    open = true
  }
  else if (nakesYnMinta === '2' || nakesYnMinta === '3') { // jika yg konsultasi adalah perawat maka... jawaban terbuka
    // console.log('ygJwbPerawat', ygJwbPerawat)
    if (item?.user_jawab === null || item?.user_jawab === '') {
      open = true
    }
    else {
      if (ygJwbPerawat) {
        open = true
      }
      else {
        open = false
      }
    }
  }
  else {
    open = false
  }

  return open
}

async function updateFlagRanap(item) {
  const findPasien = kunjunganRanap.pasiens?.find(x => x?.noreg === props?.pasien?.noreg) ?? null
  const konsultasis = findPasien?.konsultasi ?? []
  const target = konsultasis?.find(x => x?.id === item?.id) ?? null
  // const targetIndex = konsultasis?.findIndex(x => x?.id === item?.id)

  // console.log('find pasien', targetIndex, target)
  if (target) {
    if (target.flag === null || target.flag === '' || target.flag === undefined) {
      target.flag = '1'
      const payload = { id: target?.id }
      try {
        await api.post('v1/simrs/ranap/layanan/konsultasi/updateFlag', payload)
      }
      catch (error) {
        target.flag = null
      }
    }
  }

  if (item?.jawaban) {
    form.value.jawaban = item?.jawaban
  }
}

function getNewLine(text) {
  return text?.replace(/\n/g, '<br/>')
}

function onSubmit() {
  // eslint-disable-next-line prefer-const
  const { item, pasien } = props
  form.value.id = item?.id
  form.value.noreg = item?.noreg
  form.value.kelas_ruangan = pasien?.kelas_ruangan
  form.value.kdgroup_ruangan = pasien?.kdgroup_ruangan
  form.value.kdruang = pasien?.kodepoli
  form.value.kodesistembayar = pasien?.kodesistembayar
  form.value.kdgroupnakesminta = item?.nakesminta?.kdgroupnakes

  console.log('data', form.value)

  loadingSave.value = true
  return new Promise((resolve, reject) => {
    api.post('v1/simrs/ranap/layanan/konsultasi/updateJawaban', form.value)
      .then(resp => {
        console.log('resp', resp)
        if (resp.status === 200) {
          kunjunganRanap.injectUpdatean(pasien?.noreg, item?.id, resp.data.result, 'konsultasi')
          loadingSave.value = false
          notifSuccess(resp)
        }
        resolve(resp)
      })
      .catch(err => {
        loadingSave.value = false
        reject(err)
      })
  })
}

</script>
