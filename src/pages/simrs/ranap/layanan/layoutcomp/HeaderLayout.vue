<template>
  <q-toolbar>
    <q-btn flat dense icon="icon-mat-sort" @click="emits('toggleLeftDrawer')" />
    <q-toolbar-title class="f-12">
      <div class="row items-center q-gutter-md">
        <q-btn color="primary" class="q-pl-xs" flat>
          <div class="row items-center no-wrap q-gutter-sm text-white">
            <q-avatar size="30px">
              <img :src="getImageDokter(pasien?.datasimpeg?.kelamin, pasien?.datasimpeg)">
            </q-avatar>
            <div class="column f-12">
              <div>
                DPJP | {{ pasien?.dokter === null || pasien?.dokter === '' ? '----' : pasien?.dokter }}
              </div>
            </div>
          </div>
          <q-menu style="max-width: 460px;">
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="72px">
                  <img :src="getImageDokter(pasien?.datasimpeg?.kelamin, pasien?.datasimpeg)">
                </q-avatar>

                <div class="f12 q-mt-md q-mb-xs">
                  {{ pasien?.dokterdpjp === null || pasien?.dokterdpjp === '' ? '----' : pasien?.dokterdpjp }}
                </div>
              </div>
              <q-separator vertical inset class="q-mx-lg" />
              <div class="column">
                <div class="f-14 text-weight-bold ">
                  Ganti DPJP ?
                </div>
                <q-separator class="q-my-sm" />
                <q-form @submit="gantiDpjp">
                  <q-select v-model="search" dense outlined standout="bg-yellow-3" label="Cari Dpjp" use-input clearable
                    option-value="kddpjp" option-label="nama" :options="options" behavior="menu" hide-dropdown-icon
                    @filter="filterOptions" @update:model-value="(val) => updateKodeDpjp(val)">
                    <!-- @update:model-value="(val)=>$emit('updated', val)" -->
                    <template #prepend>
                      <q-icon name="icon-mat-search" />
                    </template>
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                    <template #option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <q-avatar size="60px">
                            <img :src="getImage(scope?.opt?.kelamin, scope.opt)">
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.nama }}</q-item-label>
                          <q-item-label caption>
                            <strong>Nip : </strong> {{ scope.opt.nip }}
                          </q-item-label>
                          <q-item-label caption>
                            <strong>KODE DPJP : </strong> {{ scope?.opt?.kddpjp ?? '-' }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-input v-model="kodedpjp" label="KODE DPJP (Automatis)" outlined standout="bg-yellow-3" dense
                    class="q-my-sm" :rules="[
                      val => ((!!val && pasien?.groups !== '2') || (pasien?.groups === '2' && !!kdpegsimrs && (!val || !!val))) || 'HARAP Hubungi bidang YANMED ...',

                    ]" readonly />
                  <!-- val => ( pasien?.groups==='2' && !!kdpegsimrs && !val ) || 'Tidak Boleh kosong', -->
                  <q-separator class="q-my-sm" />
                  <div class="text-right">
                    <q-btn color="primary" label="Simpan" push size="sm" type="submit" :loading="loadingSaveDpjp"
                      :disable="loadingSaveDpjp" />
                  </div>
                </q-form>
              </div>
            </div>
          </q-menu>
        </q-btn>
        <q-separator dark vertical class="" />
        <div>
          <div class="f-12">
            {{ pasien?.ruangan }}
          </div>
          <div class="f-12">
            {{ pasien?.ketruangan }} <span class="text-orange">BED : {{ pasien?.nomorbed }}</span>
          </div>
        </div>
        <q-separator dark vertical class="" />

        <!-- :disabled="auth?.user?.username!=='sa'" NANti ditambahkan -->
        <q-btn outline rounded color="orange" dense class="q-px-md">
          <div class="text-white">
            KASUS | {{ pengunjung.jnsKasusPasien?.uraian ?? 'Tidak diketahui' }}
          </div>
          <q-menu style="max-width: 460px;">
            <q-card>
              <q-card-section class="bg-teal text-white">
                <div class="text-bold">
                  GANTI JENIS KASUS
                </div>
              </q-card-section>
              <q-separator />
              <q-form @submit="emits('update:jeniskasus', kdJnsKasus)">
                <q-card-section>
                  <q-select filled dense v-model="kdJnsKasus" :options="pengunjung.jeniskasus" option-value="kode"
                    option-label="uraian" label="Jenis Kasus" style="width: 250px"
                    :rules="[val => !!val || 'Harap diisi ...']" />
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn dense type="submit" class="bg-primary text-white" label="Simpan" />
                </q-card-actions>
              </q-form>
            </q-card>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar-title>

    <!-- <div v-if="pasien?.dokter !== '' ">
      <q-btn
        v-if="pasien?.status==='' || pasien?.status==='2'"
        label="selesaikan layanan"
        color="negative"
        class="q-mr-lg q-px-lg"
        dense
        :loading="loadingFinish"
        :disable="loadingFinish"
        @click="selesaikanLayanan"
      />
      <q-btn
        v-else-if="pasien?.status==='3'"
        label="LAYANAN TELAH BATAL"
        color="negative"
        class="q-mr-lg q-px-lg"
        dense
      />
      <q-btn
        v-else
        label="SUDAH DILAYANI"
        color="white"
        class="q-mr-lg q-px-lg"
        dense
        outline
        disable
      />
    <!-- Icon Notifikasi Pasien Paska Operasi (Pojok Kanan Atas Sebelah Tombol Tutup) -->
    <q-btn flat round dense :color="hasPendingPaskaNotif ? 'amber-5' : 'white'" icon="icon-eva-bell-outline"
      class="q-mr-xs">
      <!-- Badge Notifikasi jika ada pasien paska operasi yang belum dikonfirmasi -->
      <q-badge v-if="hasPendingPaskaNotif" color="red" floating rounded class="animate-pulse">
        1
      </q-badge>
      <q-tooltip class="bg-white text-dark">
        Notifikasi Pasien Paska Operasi
      </q-tooltip>

      <!-- Popover Menu Detail Notifikasi -->
      <q-menu ref="menuNotifRef" style="min-width: 320px; max-width: 400px;" class="shadow-4 rounded-borders">
        <div class="bg-indigo-10 text-white q-pa-sm text-weight-bold flex items-center justify-between">
          <div class="row items-center q-gutter-x-xs">
            <q-icon name="icon-mat-notifications" size="18px" />
            <span>Notifikasi Pasien Paska Operasi</span>
          </div>
        </div>

        <!-- Detail Notifikasi Paska Op -->
        <div v-if="hasPendingPaskaNotif" class="q-pa-md bg-amber-1 border-bottom">
          <div class="text-weight-bold text-amber-10 f-12 q-mb-xs">
            PASIEN PASKA OPERASI
          </div>
          <div class="text-caption text-grey-9 q-mb-sm f-11">
            Pasien <strong>{{ pasien?.nama }}</strong> telah diantar dari Kamar Operasi oleh
            <strong>{{ lastDaftartilik?.paska_petugas_pengantar_nama || 'Petugas OK' }}</strong>.
          </div>
          <q-btn
            color="positive"
            icon="icon-mat-check_circle"
            label="Konfirmasi Pasien di Ruangan"
            no-caps
            dense
            class="full-width text-weight-bold shadow-1 q-py-xs"
            :loading="daftartilikStore.loadingSave"
            @click="konfirmasiPaskaOp"
          />
        </div>

        <!-- Status Jika Sudah Dikonfirmasi -->
        <div v-else-if="lastDaftartilik?.paska_petugas_penerima" class="q-pa-md bg-green-1">
          <div class="row items-center q-gutter-x-xs text-green-9 text-weight-bold f-12 q-mb-xs">
            <q-icon name="icon-mat-check_circle" size="18px" />
            <span>Pasien Paska Op Dikonfirmasi di Ruangan</span>
          </div>
          <div class="text-caption text-grey-8 f-11">
            Petugas Penerima (Ruangan): <strong>{{ lastDaftartilik?.paska_petugas_penerima_nama || '-' }}</strong>
          </div>
        </div>

        <!-- Jika Belum Ada Operasi/Notifikasi -->
        <div v-else class="q-pa-md text-center text-grey-6 f-11">
          <q-icon name="icon-mat-notifications_off" size="32px" class="q-mb-xs" />
          <div>Tidak ada notifikasi paska operasi.</div>
        </div>
      </q-menu>
    </q-btn>

    <q-btn v-close-popup dense flat icon="icon-mat-close" :disable="store.loading || store.loadingObat">
      <q-tooltip class="bg-white text-primary">
        Close
      </q-tooltip>
    </q-btn>
  </q-toolbar>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { ref, computed, onMounted, watch } from 'vue'
import { usePermintaanEResepStore } from 'src/stores/simrs/farmasi/permintaanresep/eresep'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useDaftarTilikStore } from 'src/stores/simrs/ranap/daftartilik'
import { notifErrVue } from 'src/modules/utils'

const store = usePermintaanEResepStore()
const pengunjung = usePengunjungRanapStore()
// eslint-disable-next-line no-unused-vars
const auth = useAplikasiStore()
const daftartilikStore = useDaftarTilikStore()

const lastDaftartilik = computed(() => {
  return daftartilikStore.items && daftartilikStore.items.length > 0 ? daftartilikStore.items[0] : null
})

const hasPendingPaskaNotif = computed(() => {
  return !!(lastDaftartilik.value && lastDaftartilik.value.paska_petugas_pengantar && !lastDaftartilik.value.paska_petugas_penerima)
})

const emits = defineEmits(['toggleLeftDrawer', 'gantidpjp', 'update:jeniskasus', 'layananSelesai'])

const search = ref('')
const kodedpjp = ref(null)
const kdpegsimrs = ref(null)
const kdJnsKasus = ref(null)
const options = ref([])
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingSaveDpjp: {
    type: Boolean,
    default: false
  },
  loadingFinish: {
    type: Boolean,
    default: false
  }
})

// Otomatis fetch data daftartilik saat pasien dimuat agar notifikasi lonceng langsung aktif dari awal
const loadDaftartilikData = () => {
  if (props.pasien) {
    daftartilikStore.getData(props.pasien)
  }
}

onMounted(() => {
  loadDaftartilikData()
})

watch(() => props.pasien, (newPasien) => {
  if (newPasien) {
    loadDaftartilikData()
  }
}, { immediate: true })

const menuNotifRef = ref(null)

const konfirmasiPaskaOp = async () => {
  console.log('konfirmasiPaskaOp dipanggil! items:', daftartilikStore.items, 'pasien:', props.pasien)
  const item = lastDaftartilik.value || (daftartilikStore.items && daftartilikStore.items.length > 0 ? daftartilikStore.items[0] : null)
  if (!item || !item.id) {
    notifErrVue('Data daftar tilik belum ditemukan!')
    return
  }
  const ok = await daftartilikStore.terimaPasienPaska(item, props.pasien)
  if (ok) {
    menuNotifRef.value?.hide()
  }
}

function updateKodeDpjp(val) {
  // console.log(props?.pasien?.groups)
  kodedpjp.value = val?.kddpjp ?? ''
  kdpegsimrs.value = val?.kdpegsimrs
}

function gantiDpjp() {
  // console.log('ok')
  const form = {
    kodedpjp: kodedpjp.value ?? '',
    kdpegsimrs: kdpegsimrs.value,
    noreg: props?.pasien?.noreg
  }

  emits('gantidpjp', form)
}

function getImage(kelamin, row) {
  if (row?.foto === null || row?.foto === '' || row?.foto === 'undefined' || row?.foto === undefined) {
    return kelamin === 'Perempuan'
      ? new URL('../../../../../assets/images/actress.svg', import.meta.url).href
      : new URL('../../../../../assets/images/user-avatar.svg', import.meta.url).href
  }
  else {
    return 'http://192.168.100.100/simpeg/foto/' + row.nip + '/' + row.foto
  }
}
function getImageDokter(kelamin, row) {
  if (row?.foto === null || row?.foto === '' || row?.foto === 'undefined' || row?.foto === undefined || row.kddpjp === null) {
    return kelamin === 'Perempuan'
      ? new URL('../../../../../assets/images/actress.svg', import.meta.url).href
      : new URL('../../../../../assets/images/user-avatar.svg', import.meta.url).href
  }
  else {
    return 'http://192.168.100.100/simpeg/foto/' + row.nip + '/' + row.foto
  }
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

// function selesaikanLayanan() {
//   // console.log('ok')
//   emits('layananSelesai')
// }
</script>
