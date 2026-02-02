<template>
    <div class="row items-center garis-bawah print-only">
        <div class="col-2 text-center">
            <img :src="logoKota" style="width: 2cm;" />
        </div>
        <div class="col-8">
            <div class="row justify-center f-18">
                PEMERINTAH KOTA PROBOLINGGO
            </div>
            <div class="row justify-center f-12 text-weight-bold">
                DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
            </div>
            <div class="row justify-center f-20 text-weight-bold">
                UOBK RSUD DOKTER MOHAMAD SALEH
            </div>
            <div class="row justify-center f-14">
                Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335) 432702
            </div>
            <div class="row justify-center f-14">
                E-mail : rsudprob@probolinggokota.go.id
            </div>
            <div class="row justify-center f-14 text-weight-bold">
                PROBOLINGGO 67219
            </div>
        </div>
        <div class="col-2 text-center">
            <img :src="logoRsud" style="width: 2cm;" />
        </div>
    </div>

    <div class="row justify-center f-16 text-weight-bold q-my-sm print-only">
        Laporan Stock Opname Farmasi Periode {{ date.formatDate((store.params.tahun + '-' + store.params.bulan + '-02'),
            'MMMM YYYY') }} {{ getNamaGudang() }}
    </div>
</template>

<script setup>
import { date } from 'quasar'
import { useLaporanMutasiFiFoFarmasiStore2 } from 'src/stores/simrs/laporan/farmasi/mutasififo/mutasi2.js'
import logoKota from 'src/assets/images/logo-kota-grey.png'
import logoRsud from 'src/assets/logos/logo-rsud.png'

const store = useLaporanMutasiFiFoFarmasiStore2()

function getNamaGudang() {
    const gudang = store.gudangs.find(g => g.value === store.params.kode_ruang)
    return gudang ? gudang.nama : '-'
}
</script>

<style scoped>
.garis-bawah {
    border-bottom: 2px solid black;
    border-top: 2px solid black;
    padding-bottom: 5px;
    padding-top: 5px;
}

@media screen {
    .print-only {
        display: none !important;
    }
}

@media print {
    .print-only {
        display: flex !important;
    }
}
</style>
