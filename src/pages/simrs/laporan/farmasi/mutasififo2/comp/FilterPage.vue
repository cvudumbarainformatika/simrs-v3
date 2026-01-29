<template>
    <div class="q-mb-md">
        <!-- Header Title -->
        <div class="row bg-primary text-white q-pa-sm q-mb-sm print-hide items-center justify-between rounded-borders">
            <div class="f-14 text-weight-bold">
                Laporan Stock Opname Farmasi
            </div>
            <div class="text-right">
                Periode: {{ date.formatDate((store.params.tahun + '-' + store.params.bulan + '-02'), 'MMMM YYYY') }} -
                {{ getNamaGudang() }}
            </div>
        </div>

        <!-- Filter Card -->
        <q-card flat bordered class="print-hide">
            <q-card-section class="q-pa-sm">
                <div class="row q-col-gutter-sm items-center">
                    <!-- <div class="col-12 col-md-2">
                        <app-autocomplete v-model="store.params.jenis" label="Jenis" autocomplete="nama"
                            option-label="nama" option-value="value" outlined :source="store.optionJenis"
                            :loading="store.loading" :disable="store.loading || !!store.ketProses"
                            @update:model-value="setJenis" dense />
                    </div> -->
                    <div class="col-12 col-md-4">
                        <app-autocomplete v-model="store.params.kode_ruang" label="Pilih Gudang / Depo"
                            autocomplete="nama" option-label="nama" option-value="value" outlined
                            :source="store.gudangs" :loading="store.loading"
                            :disable="store.loading || !!store.ketProses" dense />
                    </div>
                    <div class="col-6 col-md-2">
                        <app-autocomplete v-model="store.params.bulan" label="Pilih Bulan" autocomplete="nama"
                            option-label="nama" option-value="value" outlined :source="store.bulans"
                            :loading="store.loading" :disable="store.loading || !!store.ketProses"
                            @update:model-value="onBulanChange" dense />
                    </div>
                    <div class="col-6 col-md-1">
                        <app-input v-model="store.params.tahun" label="Tahun" outlined :loading="store.loading"
                            :disable="store.loading || !!store.ketProses" dense />
                    </div>
                    <div class="col-12 col-md-1 text-right">
                        <app-btn label="Ambil Data" :disable="store.loading || !!store.ketProses"
                            :loading="store.loading" @click="store.getInitialData(1)" dense />
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <!-- Action Buttons -->
            <!-- Action Buttons & Local Filter -->
            <q-card-section class="q-pa-sm row justify-between items-center bg-grey-1">
                <div class="row items-center q-gutter-sm">
                    <div class="text-caption text-grey-8 q-mr-md">
                        <span v-if="store.meta?.total > 0">Total Data: <b>{{ store.filteredItems.length }}</b> / {{
                            store.items.length }} items</span>
                    </div>

                    <!-- Local Filter (Only show if data exists) -->
                    <template v-if="store.items.length > 0">
                        <q-input v-model="store.filters.q" dense outlined placeholder="Cari obat di tabel..."
                            style="width: 200px" bg-color="white">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>

                        <q-checkbox v-model="store.filters.hasActivity" label="Hanya yg ada aktifitas" dense
                            color="primary" />
                    </template>
                </div>

                <div>
                    <!-- Slot untuk tombol action tambahan (print/download) dari parent -->
                    <slot name="action-buttons"></slot>
                </div>
            </q-card-section>

            <!-- Progress Indicator -->
            <div v-if="store.ketProses" class="q-pa-md row items-center justify-center bg-orange-1 text-orange-9">
                <q-spinner-dots size="2em" class="q-mr-sm" />
                <span class="text-weight-bold">{{ store.ketProses }}</span>
                <span v-if="store?.meta" class="q-mx-sm text-weight-bolder">Halaman {{ store.meta?.current_page ?
                    store.meta?.current_page + 1 : 1 }} / {{ store.meta?.last_page ?? 1 }}</span>
            </div>
        </q-card>
    </div>
</template>

<script setup>
import { date } from 'quasar'
import { useLaporanMutasiFiFoFarmasiStore2 } from 'src/stores/simrs/laporan/farmasi/mutasififo/mutasi2.js'

const store = useLaporanMutasiFiFoFarmasiStore2()

function setJenis(val) {
    if (store.items?.length) store.getInitialData(1)
}

function onBulanChange() {
    store.items = []
    store.meta = {}
    store.setParams('page', 1)
}

function getNamaGudang() {
    const gudang = store.gudangs.find(g => g.value === store.params.kode_ruang)
    return gudang ? gudang.nama : '-'
}
</script>
