<template>
    <div class="q-mt-xl avoid-break" ref="refTt">
        <div class="q-my-md">
            <div class="row q-mb-md">
                <div class="col-4" />
                <div class="col-4" />
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ pojokKananAtas }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ kiriAtasSatu }}
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ tengahAtasSatu }}
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ kananAtasSatu }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ kiriAtasDua }}
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ tengahAtasDua }}
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ kananAtasDua }}
                    </div>
                </div>
            </div>
            <div class="row q-mt-xl text-weight-bold">
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ kiriBawahSatu }}
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ tengahBawahSatu }}
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ kananBawahSatu }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ kiriBawahDua }}
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ tengahBawahDua }}
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        {{ kananBawahDua }}
                    </div>
                </div>
            </div>
        </div>
        <div class="q-my-md print-hide">
            <div class="row ">
                <div class="col-4" />
                <div class="col-4" />
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="pojokKananAtas" label="tanggal" valid outlined />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="kiriAtasSatu" label="kiri atas satu" valid outlined />
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="tengahAtasSatu" label="tengah atas satu" valid outlined />
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="kananAtasSatu" label="kanan atas satu" valid outlined />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="kiriAtasDua" label="kiri atas dua" valid outlined />
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="tengahAtasDua" label="tengah atas dua" valid outlined />
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="kananAtasDua" label="kanan atas dua" valid outlined />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="kiriBawahSatu" label="kiri bawah satu" valid outlined />
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="tengahBawahSatu" label="tengah bawah satu" valid outlined />
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="kananBawahSatu" label="kanan bawah satu" valid outlined />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="kiriBawahDua" label="kiri bawah dua" valid outlined />
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="tengahBawahDua" label="tengah bawah dua" valid outlined />
                    </div>
                </div>
                <div class="col-4">
                    <div class="text-center f-10">
                        <app-input v-model="kananBawahDua" label="kanan bawah dua" valid outlined />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { date } from 'quasar'
import { ref } from 'vue'

const kiriAtasSatu = ref('')
const kiriAtasDua = ref('Kepala Bagian Keuangan')
const kiriBawahSatu = ref('')
const kiriBawahDua = ref('')

const tengahAtasSatu = ref('')
const tengahAtasDua = ref('Kepala Instalasi Farmasi')
const tengahBawahSatu = ref('')
const tengahBawahDua = ref('')

const kananAtasSatu = ref('')
const kananAtasDua = ref('Petugas Bagian Barang')
const kananBawahSatu = ref('')
const kananBawahDua = ref('')

const pojokKananAtas = ref('Probolinggo, ' + date.formatDate(Date.now(), 'DD MMMM YYYY'))

// Expose refTt agar bisa diakses parent untuk perhitungan tinggi scroll
const refTt = ref(null)

defineExpose({
    refTt
})
</script>

<style scoped>
.avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
}
</style>
