<template>
  <q-card flat bordered class="spo-card">
    <q-card-section class="q-pa-md q-pb-sm">
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-sm">
          <div class="text-h6 text-weight-bold">Standar Prosedur Operasional</div>
          <div class="text-caption text-grey-7">Temukan SPO berdasarkan kode, judul, atau unit pelayanan.</div>
        </div>
        <div class="col-12 col-sm-auto text-grey-7 text-caption">
          {{ store.total }} SPO ditemukan
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-sm">
        <div class="col">
          <q-input
            v-model="store.params.q"
            outlined
            dense
            clearable
            debounce="400"
            placeholder="Cari kode, judul, atau unit SPO"
            @update:model-value="store.getList"
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <div class="col-auto">
          <q-btn outline color="primary" icon="refresh" :loading="store.loading" @click="store.getList">
            <q-tooltip>Muat ulang daftar</q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-sm">
        <div class="col-12 col-sm-6">
          <q-select
            v-model="store.params.pemilik"
            :options="ownerOptions"
            outlined
            dense
            clearable
            label="Filter pemilik"
            @update:model-value="store.getList"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-select
            v-model="store.params.unit"
            :options="unitOptions"
            outlined
            dense
            clearable
            label="Filter unit terkait"
            @update:model-value="store.getList"
          />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-virtual-scroll
      v-if="store.items.length"
      :items="store.items"
      separator
      class="spo-list"
      style="max-height: 600px"
      @virtual-scroll="loadMoreWhenNeeded"
    >
      <template #default="{ item, index }">
      <q-card :key="item.id" flat bordered class="spo-item-card q-mx-sm q-my-sm">
      <q-item class="q-py-md">
        <q-item-section avatar top>
          <q-avatar color="blue-1" text-color="primary" icon="description" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="row items-center q-gutter-sm">
            <q-badge color="grey-7" outline>No. {{ index + 1 }}</q-badge>
            <q-badge color="primary" outline class="text-weight-bold">{{ item.kode }}</q-badge>
            <span class="text-weight-medium text-body1">{{ item.judul }}</span>
          </q-item-label>

          <q-item-label caption class="q-mt-sm row q-col-gutter-md">
            <span class="col-auto"><b>Nomor Revisi:</b> {{ item.nomor_revisi || '-' }}</span>
            <span class="col-auto"><b>Pemilik:</b> {{ item.pemilik || '-' }}</span>
          </q-item-label>

          <q-item-label v-if="item.file" caption class="q-mt-xs">
            <q-icon name="attach_file" size="14px" /> <b>File:</b> {{ item.file }}
          </q-item-label>

          <div v-if="unitList(item).length" class="q-mt-sm row q-gutter-xs">
            <q-chip v-for="unit in unitList(item)" :key="unit" dense color="grey-2" text-color="grey-8">
              {{ unit }}
            </q-chip>
          </div>
        </q-item-section>

        <q-item-section side top class="text-right">
          <q-item-label caption><b>Tanggal SPO</b></q-item-label>
          <q-item-label caption>{{ formatDate(item.tanggal) }}</q-item-label>
          <q-btn
            v-if="item.file"
            class="q-mt-sm"
            color="primary"
            outline
            dense
            no-caps
            icon="visibility"
            label="Lihat Dokumen"
            type="a"
            :href="documentUrl(item)"
            target="_blank"
            rel="noopener"
          />
        </q-item-section>
      </q-item>
      </q-card>
      </template>
    </q-virtual-scroll>

    <div v-if="store.loadingMore" class="row justify-center q-pa-md">
      <q-spinner color="primary" size="24px" />
    </div>

    <div v-if="!store.loading && !store.items.length" class="column flex-center q-pa-xl text-grey-7">
      <q-icon name="find_in_page" size="44px" class="q-mb-sm" />
      <div class="text-weight-medium">SPO tidak ditemukan</div>
      <div class="text-caption">Coba gunakan kata kunci lain.</div>
    </div>

    <q-inner-loading :showing="store.loading">
      <q-spinner color="primary" size="40px" />
    </q-inner-loading>
  </q-card>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSpoStore } from 'src/stores/spo/spo'

const store = useSpoStore()
const documentBaseUrl = `${process.env.API}/spo/uploadsxxxspo`

const ownerOptions = computed(() => [...new Set(
  store.items.map(item => item?.pemilik?.trim()).filter(Boolean)
)].sort())

const unitOptions = computed(() => [...new Set(
  store.items.flatMap(unitList)
)].sort())

onMounted(() => {
  store.getList()
})

function unitList (item) {
  return (item?.unit ?? '').split('|').map(unit => unit.trim()).filter(Boolean)
}

function formatDate (value) {
  if (!value || value === '0000-00-00') return '-'

  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function documentUrl (item) {
  return `${documentBaseUrl}/${encodeURIComponent(item.folder || item.kode)}/${encodeURIComponent(item.file)}`
}
function loadMoreWhenNeeded ({ to }) {
  if (to >= store.items.length - 1) store.loadMore()
}
</script>

<style scoped>
.spo-card {
  min-height: 320px;
  position: relative;
}

.spo-item-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgb(28 78 121 / 7%);
}

.spo-list :deep(.q-item) {
  transition: background-color .18s ease;
}

.spo-list :deep(.q-item:hover) {
  background: #f5f9ff;
}
</style>
