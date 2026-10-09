<template>
  <q-page class="q-pa-md uang-jaminan-page">
    <q-card flat bordered class="form-card">
      <q-card-section class="bg-primary text-white row items-center q-py-sm">
        <q-icon name="icon-mat-account_balance_wallet" size="sm" class="q-mr-sm" />
        <div>
          <div class="text-subtitle1 text-weight-bold">Uang Jaminan</div>
          <div class="text-caption">Pencatatan uang jaminan pasien melalui QRIS atau Virtual Account</div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="store.simpan">
          <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-input v-model="store.form.noreg" outlined dense label="No. Registrasi" readonly
              :rules="[val => !!val || 'Pilih pasien terlebih dahulu']">
              <template #append>
                <q-icon name="icon-mat-refresh" color="primary" size="sm" class="cursor-pointer" @click="store.bukaDialogPasien" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3">
            <q-input v-model="store.form.norm" outlined dense label="No. RM" readonly />
          </div>
          <div class="col-12 col-sm-5">
            <q-input v-model="store.form.nama" outlined dense label="Nama pasien" readonly />
          </div>
          </div>
          <div class="row q-col-gutter-md q-mt-xs items-end">
          <div class="col-12 col-sm-3">
            <q-input v-model="store.form.tanggal" outlined dense type="datetime-local" label="Tanggal" :disable="store.saving"
              :rules="[val => !!val || 'Tanggal wajib diisi']" />
          </div>
          <div class="col-12 col-sm-3">
            <q-select v-model="store.form.jenis_pembayaran" outlined dense label="Jenis pembayaran" :disable="store.saving"
              :options="jenisPembayaran" emit-value map-options :rules="[val => !!val || 'Jenis pembayaran wajib diisi']" />
          </div>
          <div v-if="store.form.jenis_pembayaran === 'VA'" class="col-12 col-sm-3">
            <q-input v-model.trim="store.form.no_va" outlined dense :label="store.form.jenis_pembayaran === 'QRIS' ? 'No. QRIS' : 'No. VA'" :disable="store.saving"
              :rules="[val => !!val || 'Nomor pembayaran wajib diisi']" />
          </div>
          <div class="col-12 col-sm-3">
              <q-input v-model="jumlahText" outlined dense inputmode="numeric" label="Jumlah" prefix="Rp"
                :disable="store.saving" :rules="[() => Number(store.form.jumlah) > 0 || 'Jumlah harus lebih dari 0']" />
          </div>
          </div>
          <div class="col-12 text-right">
            <q-btn type="submit" color="primary" icon="icon-mat-save" label="Simpan" :loading="store.saving" no-caps />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mt-md">
      <q-card-section class="row q-col-gutter-md items-center q-py-sm">
        <div class="col-12 col-sm-auto text-subtitle1 text-weight-bold">Riwayat uang jaminan</div>
        <q-space />
        <div class="col-12 col-sm-3">
          <q-input v-model="store.params.from" outlined dense type="date" label="Dari tanggal" @update:model-value="store.getData" />
        </div>
        <div class="col-12 col-sm-3">
          <q-input v-model="store.params.to" outlined dense type="date" label="Sampai tanggal" @update:model-value="store.getData" />
        </div>
        <div class="col-auto">
          <q-btn flat round dense color="primary" icon="icon-mat-refresh" :loading="store.loading" @click="store.getData" />
        </div>
      </q-card-section>
      <q-separator />
      <q-table flat dense row-key="id" :rows="store.items" :columns="columns" :loading="store.loading" hide-bottom
        :rows-per-page-options="[0]">
        <template #body-cell-jumlah="props">
          <q-td :props="props" class="text-right text-weight-medium">{{ rupiah(props.value) }}</q-td>
        </template>
        <template #body-cell-jenis_pembayaran="props">
          <q-td :props="props"><q-badge :color="['Q', 'QRIS'].includes(props.value) ? 'purple' : 'primary'" :label="['Q', 'QRIS'].includes(props.value) ? 'QRIS' : 'VA'" /></q-td>
        </template>
        <template #no-data>
          <div class="full-width row flex-center text-grey q-pa-lg">Belum ada transaksi uang jaminan.</div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="store.pasienDialog" persistent>
      <q-card style="width: 900px; max-width: 96vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Pilih pasien</div>
          <q-space />
          <q-btn flat round dense icon="icon-mat-close" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pb-none">
          <q-tabs :model-value="store.pasienParams.pelayanan" dense active-color="primary" indicator-color="primary" align="left"
            @update:model-value="store.setPelayananPasien">
            <q-tab name="igd" label="Kunjungan IGD" />
            <q-tab name="ranap" label="Rawat Inap" />
          </q-tabs>
          <q-input v-model="store.pasienParams.q" outlined dense clearable class="q-mt-md" label="Cari noreg, norm, atau nama"
            @update:model-value="store.getPasien">
            <template #append><q-icon name="icon-mat-search" /></template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-table flat bordered dense row-key="noreg" :rows="store.pasienItems" :columns="pasienColumns" :loading="store.pasienLoading"
            :rows-per-page-options="[0]" hide-bottom>
            <template #body-cell-pilih="props">
              <q-td :props="props"><q-btn dense flat color="primary" label="Pilih" @click="store.pilihPasien(props.row)" /></q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useUangJaminanKasirStore } from 'src/stores/simrs/kasir/uangjaminan'

const store = useUangJaminanKasirStore()

const columns = [
  { name: 'tanggal', label: 'Tanggal', field: 'tanggal', align: 'left', sortable: true },
  { name: 'jenis_pembayaran', label: 'Jenis pembayaran', field: 'jenis_pembayaran', align: 'left' },
  { name: 'noreg', label: 'No. Registrasi', field: 'noreg', align: 'left' },
  { name: 'nota', label: 'No. Nota', field: 'nota', align: 'left' },
  { name: 'no_va', label: 'Nomor pembayaran', field: 'no_va', align: 'left', sortable: true },
  { name: 'jumlah', label: 'Jumlah', field: 'jumlah', align: 'right', sortable: true }
]

const pasienColumns = [
  { name: 'noreg', label: 'No. Registrasi', field: 'noreg', align: 'left' },
  { name: 'norm', label: 'No. RM', field: 'norm', align: 'left' },
  { name: 'nama', label: 'Nama pasien', field: 'nama', align: 'left' },
  { name: 'no_va', label: 'No. VA', field: 'no_va', align: 'left' },
  { name: 'tanggal_masuk', label: 'Tanggal masuk', field: 'tanggal_masuk', align: 'left' },
  { name: 'pilih', label: '', field: 'pilih', align: 'right' }
]

const jenisPembayaran = [
  { label: 'QRIS', value: 'QRIS' },
  { label: 'VA', value: 'VA' }
]

const jumlahText = computed({
  get: () => store.form.jumlah ? Number(store.form.jumlah).toLocaleString('id-ID') : '',
  set: (value) => {
    const nominal = Number(String(value ?? '').replace(/\D/g, ''))
    store.form.jumlah = nominal || null
  }
})

function rupiah (value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value || 0))
}

watch(() => store.form.jenis_pembayaran, (jenis) => {
  if (jenis === 'QRIS') store.form.no_va = ''
})

onMounted(() => {
  store.setFilterBulanBerjalan()
  store.getData()
})
</script>

<style scoped>
.uang-jaminan-page { max-width: 1100px; margin: 0 auto; }
.form-card { overflow: hidden; }
</style>
