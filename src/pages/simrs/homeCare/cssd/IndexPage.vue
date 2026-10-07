<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6">Permintaan CSSD</div>
        <div class="text-caption text-grey-7">Permintaan barang untuk kebutuhan bersama ruangan</div>
      </div>
      <q-btn
        unelevated
        color="primary"
        label="Permintaan Baru"
        @click="permintaanBaru"
      />
    </div>

    <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
      Ruangan pengaju: <b>{{ store.ruangan || (store.loading ? 'Memuat ruangan...' : 'Tidak tersedia') }}</b>.
      Permintaan tidak dikaitkan dengan pasien.
    </q-banner>

    <q-tabs
      v-model="store.kategori"
      dense
      align="left"
      class="bg-white text-primary q-mb-md"
      active-color="primary"
      indicator-color="primary"
      @update:model-value="gantiKategori"
    >
      <q-tab name="instrumen" label="Instrumen" />
      <q-tab name="kassa" label="Kassa" />
    </q-tabs>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-5">
        <q-card flat bordered>
          <q-card-section class="row items-center justify-between">
            <div class="text-subtitle1 text-weight-medium">
              {{ store.permintaanAktif?.nopermintaan ? `Permintaan ${store.permintaanAktif.nopermintaan}` : 'Form Permintaan' }}
            </div>
            <q-badge
              v-if="store.permintaanAktif"
              :color="sudahDilayani ? 'positive' : 'orange'"
              :label="sudahDilayani ? 'Sudah dilayani' : 'Menunggu CSSD'"
            />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-select
              v-model="barang"
              :options="store.barangOptions"
              option-label="nama"
              use-input
              fill-input
              hide-selected
              clearable
              input-debounce="300"
              label="Cari barang berdasarkan kode atau nama"
              outlined
              :disable="sudahDilayani"
              @filter="filterBarang"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.kodebarang }} — {{ scope.opt.nama }}</q-item-label>
                    <q-item-label caption>Stok CSSD: {{ scope.opt.stok }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #selected-item="scope">
                <span>{{ scope.opt.kodebarang }} — {{ scope.opt.nama }} (stok {{ scope.opt.stok }})</span>
              </template>
            </q-select>

            <q-input
              v-model.number="jumlah"
              type="number"
              min="1"
              step="1"
              label="Jumlah"
              outlined
              class="q-mt-md"
              :disable="sudahDilayani"
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                unelevated
                color="primary"
                label="Simpan Barang"
                :loading="store.saving"
                :disable="!store.ruangan || sudahDilayani || !barang || !jumlah || Number(jumlah) < 1"
                @click="simpanBarang"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-md">
          <q-card-section class="text-subtitle1 text-weight-medium">
            Daftar Permintaan {{ store.kategori === 'kassa' ? 'Kassa' : 'Instrumen' }}
          </q-card-section>
          <q-separator />
          <q-inner-loading :showing="store.loading">
            <q-spinner color="primary" size="32px" />
          </q-inner-loading>
          <q-list v-if="store.permintaan.length" separator>
            <q-item
              v-for="item in store.permintaan"
              :key="item.nopermintaan"
              clickable
              v-ripple
              :active="store.permintaanAktif?.nopermintaan === item.nopermintaan"
              active-class="bg-blue-1"
              @click="bukaPermintaan(item.nopermintaan)"
            >
              <q-item-section>
                <q-item-label>{{ item.nopermintaan }}</q-item-label>
                <q-item-label caption>{{ item.tgl_trans }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  :color="dilayani(item.layani) ? 'positive' : 'orange'"
                  :label="dilayani(item.layani) ? 'Dilayani' : 'Menunggu'"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-section v-else-if="!store.loading" class="text-grey-7">
            Belum ada permintaan untuk kategori ini.
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-7">
        <q-card flat bordered>
          <q-card-section class="row items-center justify-between">
            <div class="text-subtitle1 text-weight-medium">Rincian Barang</div>
            <div v-if="store.permintaanAktif" class="text-caption text-grey-7">
              {{ store.permintaanAktif.nopermintaan }}
            </div>
          </q-card-section>
          <q-separator />
          <q-inner-loading :showing="store.loadingRincian">
            <q-spinner color="primary" size="32px" />
          </q-inner-loading>
          <q-markup-table v-if="store.rincian.length" flat>
            <thead>
              <tr>
                <th class="text-left">Kode</th>
                <th class="text-left">Nama Barang</th>
                <th class="text-right">Jumlah</th>
                <th v-if="!sudahDilayani" class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in store.rincian" :key="item.id">
                <td>{{ item.kodebarang }}</td>
                <td>{{ item.nama }}</td>
                <td class="text-right">{{ item.jumlah }}</td>
                <td v-if="!sudahDilayani" class="text-right">
                  <q-btn
                    flat
                    dense
                    color="negative"
                    label="Hapus"
                    :loading="store.deletingId === item.id"
                    @click="hapusBarang(item)"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
          <q-card-section v-else-if="store.permintaanAktif && !store.loadingRincian" class="text-grey-7">
            Belum ada barang pada permintaan ini.
          </q-card-section>
          <q-card-section v-else-if="!store.permintaanAktif" class="text-grey-7">
            Pilih permintaan yang ada atau buat permintaan baru, lalu tambahkan barang.
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useHomeCareCssdStore } from 'src/stores/simrs/homeCare/cssd'

const store = useHomeCareCssdStore()
const $q = useQuasar()
const barang = ref(null)
const jumlah = ref(1)

const sudahDilayani = computed(() => dilayani(store.permintaanAktif?.layani))

function dilayani (value) {
  return String(value) === '1'
}

onMounted(() => {
  muatPermintaan()
})

async function muatPermintaan () {
  try {
    await store.getPermintaan()
  } catch (error) {
    beriNotifikasiError(error, 'Daftar permintaan CSSD gagal dimuat')
  }
}

async function gantiKategori () {
  store.permintaanBaru()
  barang.value = null
  jumlah.value = 1
  await muatPermintaan()
}

function permintaanBaru () {
  store.permintaanBaru()
  barang.value = null
  jumlah.value = 1
}

async function filterBarang (val, update, abort) {
  if (!val) {
    update(() => {
      store.barangOptions = []
    })
    return
  }

  try {
    const options = await store.cariBarang(val)
    update(() => {
      store.barangOptions = options
    })
  } catch (error) {
    abort()
    beriNotifikasiError(error, 'Pencarian barang CSSD gagal')
  }
}

async function bukaPermintaan (nopermintaan) {
  barang.value = null
  jumlah.value = 1
  try {
    await store.bukaPermintaan(nopermintaan)
  } catch (error) {
    beriNotifikasiError(error, 'Rincian permintaan CSSD gagal dimuat')
  }
}

async function simpanBarang () {
  try {
    await store.simpanBarang({
      kodebarang: barang.value.kodebarang,
      jumlah: Number(jumlah.value)
    })
    barang.value = null
    jumlah.value = 1
    $q.notify({ type: 'positive', message: 'Barang berhasil ditambahkan' })
  } catch (error) {
    beriNotifikasiError(error, 'Barang gagal disimpan')
  }
}

async function hapusBarang (item) {
  try {
    await store.hapusBarang(item.id)
    $q.notify({ type: 'positive', message: 'Barang berhasil dihapus' })
  } catch (error) {
    beriNotifikasiError(error, 'Barang gagal dihapus')
  }
}

function beriNotifikasiError (error, fallback) {
  $q.notify({
    type: 'negative',
    message: error?.response?.data?.message || fallback
  })
}
</script>
