<template>
  <q-page class="igd-page q-pa-md">
    <section class="hero q-mb-md">
      <div class="row items-center q-gutter-sm"><q-avatar color="white" text-color="primary" icon="icon-mat-emergency"
          size="42px" />
        <div>
          <div class="text-h6 text-weight-bold">Kasir IGD</div>
          <div class="text-caption text-blue-1">Pasien IGD yang telah pulang</div>
        </div>
      </div><q-btn unelevated color="white" text-color="primary" icon="icon-mat-refresh" label="Muat ulang"
        :loading="store.loading" @click="store.getLists" />
    </section>
    <q-card flat bordered class="filter-card q-mb-md"><q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-4"><q-input v-model="search" outlined dense clearable debounce="500"
              label="Cari nama, No. RM, atau registrasi" @update:model-value="store.setQ(search || '')"><template
                #prepend><q-icon name="icon-mat-search" /></template></q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-3"><q-input v-model="from" outlined dense label="Tanggal dari" readonly><template
                #append><q-icon name="icon-mat-event" class="cursor-pointer"><q-popup-proxy cover><q-card><q-date
                      v-model="from" mask="YYYY-MM-DD" /><q-card-actions align="right" class="q-px-sm q-pb-sm"><q-btn v-close-popup unelevated color="primary"
                        label="Terapkan" @click="reloadRange" /></q-card-actions></q-card></q-popup-proxy></q-icon></template></q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-3"><q-input v-model="to" outlined dense label="Tanggal sampai" readonly><template
                #append><q-icon name="icon-mat-event" class="cursor-pointer"><q-popup-proxy cover><q-card><q-date
                      v-model="to" mask="YYYY-MM-DD" /><q-card-actions align="right" class="q-px-sm q-pb-sm"><q-btn v-close-popup unelevated color="primary"
                        label="Terapkan" @click="reloadRange" /></q-card-actions></q-card></q-popup-proxy></q-icon></template></q-input>
          </div>
        </div>
      </q-card-section></q-card>
    <q-card flat bordered class="list-card"><q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-bold">Pasien pulang IGD</div>
          <div class="text-caption text-grey-7">{{ store.meta?.total || 0 }} data ditemukan</div>
        </div>
      </q-card-section><q-separator /><q-card-section v-if="store.loading" class="q-pa-xl text-center"><q-spinner
          color="negative" size="2em" />
        <div class="q-mt-sm">Memuat pasien...</div>
      </q-card-section><q-card-section v-else-if="!store.items.length" class="q-pa-xl text-center text-grey-7"><q-icon
          name="icon-mat-folder_off" size="48px" />
        <div class="q-mt-sm">Tidak ada pasien pulang pada rentang tanggal ini.</div>
      </q-card-section><q-list v-else padding><q-item v-for="item in store.items" :key="item.noreg"
          clickable v-ripple class="patient-item q-mb-sm" @click="openPayment(item)"><q-item-section avatar><app-avatar-pasien
              :pasien="item" /></q-item-section><q-item-section>
            <div class="row items-center q-gutter-sm"><q-item-label class="text-subtitle1 text-weight-bold">{{ item.nama
              ||
              'Nama pasien belum tersedia' }}</q-item-label><q-badge outline color="primary">RM {{ item.norm
                }}</q-badge><q-badge outline color="teal">{{ gender(item.kelamin) }}</q-badge><q-badge outline
                color="orange">{{ age(item.tgllahir) }}</q-badge></div><q-item-label caption class="q-mt-xs">No.
              Registrasi:
              {{ item.noreg }} <span class="q-mx-sm">|</span> {{ item.sistem_bayar || '-' }}</q-item-label><q-item-label
              caption>Masuk: {{ item.tanggal_masuk }} <span class="q-mx-sm">|</span> Pulang: {{ item.tanggal_pulang
              }}</q-item-label>
          </q-item-section><q-item-section side><q-badge color="positive"
              label="Sudah Pulang" /></q-item-section></q-item></q-list><q-separator /><q-card-actions
        align="between"><span class="text-caption">Halaman {{ store.meta?.current_page || 1 }} dari {{
          store.meta?.last_page || 1
        }}</span><q-pagination v-model="page" :max="store.meta?.last_page || 1" :max-pages="7" direction-links
          boundary-links color="negative" /></q-card-actions></q-card>
    <DialogPembayaranPage v-model="paymentDialog" :patient="selectedPatient" />
  </q-page>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useKasirIgdStore } from 'src/stores/simrs/kasir/igd/kasirigd'
import DialogPembayaranPage from './comp/DialogPembayaranPage.vue'
const store = useKasirIgdStore()
const search = ref(store.params.q)
const from = ref(store.params.from)
const to = ref(store.params.to)
const paymentDialog = ref(false)
const selectedPatient = ref(null)
const page = computed({ get: () => store.params.page, set: value => store.setPage(value) })
onMounted(() => store.getLists())
function openPayment (patient) { selectedPatient.value = patient; paymentDialog.value = true }
function reloadRange() { if (from.value && to.value) store.setDateRange(from.value, to.value) }
function gender(value) { return value === 'L' ? 'Laki-laki' : value === 'P' ? 'Perempuan' : value || '-' }
function age(value) { if (!value) return 'Usia -'; const birth = new Date(value); const today = new Date(); let years = today.getFullYear() - birth.getFullYear(); if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) years--; return years >= 0 ? `${years} tahun` : 'Usia -' }
</script>
<style lang="scss" scoped>
.igd-page {
  background: #f7f8fb;
  min-height: 100%;
}

.hero {
  background: linear-gradient(110deg, #1565c0, #42a5f5);
  color: #fff;
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-card,
.list-card,
.patient-item {
  border-radius: 12px;
}

.patient-item {
  border: 1px solid #eceff3;
}

.patient-item:hover {
  border-color: #e8a0a5;
  box-shadow: 0 3px 10px rgba(181, 31, 44, .08);
}
</style>
