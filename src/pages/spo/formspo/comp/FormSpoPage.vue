<template>
  <q-card flat bordered class="spo-form-card">
    <q-card-section class="spo-form-header text-white">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col">
          <div class="row items-center q-gutter-sm">
            <q-avatar color="white" text-color="primary" icon="description" />
            <div>
              <div class="text-h6 text-weight-bold">{{ isEdit ? 'Ubah Dokumen SPO' : 'Tambah Dokumen SPO' }}</div>
              <div class="text-caption text-blue-1">Simpan dokumen dan tetapkan unit yang berkaitan.</div>
            </div>
          </div>
        </div>
        <div class="col-auto"><q-btn flat dense icon="arrow_back" label="Kembali" :to="{ name: 'spo.form' }" /></div>
      </div>
    </q-card-section>

    <q-form class="q-pa-md q-gutter-lg" @submit="save">
      <q-banner v-if="isEdit" rounded class="bg-blue-1 text-primary">
        Anda sedang mengubah SPO <b>{{ form.nomorSpo }}</b>. Dokumen lama dipertahankan bila upload dikosongkan.
      </q-banner>

      <section>
        <div class="section-title"><q-icon name="article" color="primary" /> Informasi dokumen</div>
        <div class="row q-col-gutter-md q-mt-xs">
          <div class="col-12 col-sm-6"><q-input v-model="form.nomorSpo" outlined readonly label="Nomor SPO" hint="Nomor akan dibuat otomatis setelah disimpan." /></div>
          <div class="col-12 col-sm-6"><q-input v-model="form.nomorRevisi" outlined label="Nomor revisi" /></div>
          <div class="col-12"><q-input v-model="form.namaSpo" outlined label="Nama / judul SPO" :rules="[required]" /></div>
          <div class="col-12 col-sm-6"><q-input v-model="form.tanggalSpo" outlined label="Tanggal SPO" type="date" :rules="[required]" /></div>
          <div class="col-12 col-sm-6">
            <q-file v-model="form.dokumen" outlined clearable label="Upload dokumen" accept=".pdf,.doc,.docx" hint="PDF, DOC, atau DOCX; maksimal 10 MB">
              <template #prepend><q-icon name="upload_file" /></template>
            </q-file>
            <div v-if="documentName" class="text-caption q-mt-sm text-grey-8"><q-icon name="attach_file" /> Dokumen saat ini: {{ documentName }}</div>
          </div>
        </div>
      </section>

      <q-separator />

      <section>
        <div class="section-title"><q-icon name="business" color="primary" /> Unit pelayanan</div>
        <div class="row q-col-gutter-md q-mt-xs">
          <div class="col-12"><q-select v-model="form.pemilik" :options="unitOptions" outlined clearable label="Unit pemilik" :loading="loading" :rules="[required]" /></div>
          <div class="col-12">
            <div class="row items-center justify-between q-mb-sm">
              <div><div class="text-weight-medium">Unit terkait</div><div class="text-caption text-grey-7">Pilih unit yang menggunakan atau terdampak SPO ini.</div></div>
              <div class="q-gutter-xs"><q-btn outline dense no-caps label="Pilih semua" @click="selectAllUnits" /><q-btn flat dense no-caps label="Bersihkan" @click="clearUnits" /></div>
            </div>
            <q-card flat bordered class="unit-picker">
              <q-card-section v-if="loading" class="row q-col-gutter-sm"><div v-for="n in 6" :key="n" class="col-6 col-md-3"><q-skeleton type="QChip" /></div></q-card-section>
              <q-card-section v-else-if="unitOptions.length" class="row q-col-gutter-sm">
                <div v-for="unit in unitOptions" :key="unit" class="col-12 col-sm-6 col-md-4"><q-checkbox v-model="form.unitTerkait" :val="unit" :label="unit" color="primary" /></div>
              </q-card-section>
              <q-card-section v-else class="text-grey-7">Master unit belum tersedia.</q-card-section>
            </q-card>
          </div>
        </div>
      </section>

      <div class="row justify-end q-gutter-sm">
        <q-btn flat no-caps label="Batal" :to="{ name: 'spo.form' }" />
        <q-btn color="primary" unelevated no-caps icon="save" label="Simpan SPO" type="submit" :loading="saving" />
      </div>
    </q-form>
    <q-inner-loading :showing="loading"><q-spinner-dots color="primary" size="42px" /></q-inner-loading>
  </q-card>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const unitOptions = ref([])
const item = ref(null)
const form = reactive({ id: null, nomorSpo: '', nomorRevisi: '', namaSpo: '', tanggalSpo: '', dokumen: null, pemilik: '', unitTerkait: [] })
const isEdit = computed(() => !!form.id)
const documentName = computed(() => item.value?.file ?? '')
const required = value => !!value || 'Wajib diisi'

onMounted(loadForm)

async function loadForm () {
  loading.value = true
  try {
    const id = route.query.id
    const response = await api.get(`v1/spo/spo/form${id ? `/${id}` : ''}`)
    unitOptions.value = response.data.units ?? []
    item.value = response.data.item
    if (item.value) {
      form.id = item.value.id
      form.nomorSpo = item.value.kode ?? ''
      form.nomorRevisi = item.value.nomor_revisi ?? ''
      form.namaSpo = item.value.judul ?? ''
      form.tanggalSpo = item.value.tanggal ?? ''
      form.pemilik = item.value.pemilik ?? ''
      form.unitTerkait = String(item.value.unit ?? '').split('|').filter(Boolean)
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: error?.response?.data?.message ?? 'Form SPO gagal dimuat.' })
  } finally {
    loading.value = false
  }
}

function selectAllUnits () { form.unitTerkait = [...unitOptions.value] }
function clearUnits () { form.unitTerkait = [] }

async function save () {
  saving.value = true
  try {
    const payload = new FormData()
    if (form.id) payload.append('id', form.id)
    payload.append('nomor_spo', form.nomorSpo)
    payload.append('nomor_revisi', form.nomorRevisi ?? '')
    payload.append('nama_spo', form.namaSpo)
    payload.append('tanggal_spo', form.tanggalSpo)
    payload.append('pemilik', form.pemilik)
    form.unitTerkait.forEach(unit => payload.append('unit_terkait[]', unit))
    if (form.dokumen) payload.append('dokumen', form.dokumen)
    const response = await api.post('v1/spo/spo/form', payload)
    $q.notify({ type: 'positive', message: response.data.message ?? 'SPO berhasil disimpan.' })
    router.push({ name: 'spo.form' })
  } catch (error) {
    $q.notify({ type: 'negative', message: error?.response?.data?.message ?? 'SPO gagal disimpan.' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.spo-form-card { max-width: 980px; margin: 0 auto; overflow: hidden; }
.spo-form-header { background: linear-gradient(120deg, #1565c0, #42a5f5); }
.section-title { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 700; color: #263238; }
.unit-picker { max-height: 270px; overflow-y: auto; background: #fafcff; }
</style>
