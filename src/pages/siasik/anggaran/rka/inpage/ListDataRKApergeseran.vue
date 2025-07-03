<template>
  <template v-if="store.datarkapergeseran?.length">
    <q-card-section class="full-width">
      <div class="row q-py-md">
        <div class="full-width">
          <q-markup-table flat bordered wrap-cells :separator="separator">
            <thead style="height: 35px;">
              <tr>
                <th colspan="3">
                  Sebelum Perubahan
                </th>
                <th colspan="2">
                  Setelah Perubahan
                </th>
              </tr>
              <tr>
                <th>
                  Indikator
                </th>
                <th>
                  Tolak Ukur Kerja
                </th>
                <th>
                  Target Kinerja
                </th>
                <th>
                  Tolak Ukur Kerja
                </th>
                <th>
                  Target Kinerja
                </th>
              </tr>
            </thead>
            <tbody style="height: 30px;">
              <tr>
                <td>
                  Capaian Kegiatan
                </td>
                <td>
                  {{ store.capaiankegiatan }}
                  <q-popup-edit v-model="store.capaiankegiatan" v-slot="scope" @update:model-value="(val) => {
                    store.capaiankegiatan = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td class="text-right">
                  {{ store.targetcapaian }}
                  <q-popup-edit v-model="store.targetcapaian" v-slot="scope" @update:model-value="(val) => {
                    store.targetcapaian = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <!-- SETELAH PERGESERAN -->
                <td>
                  {{ store.capaiankegiatan }}
                  <q-popup-edit v-model="store.capaiankegiatan" v-slot="scope" @update:model-value="(val) => {
                    store.capaiankegiatan = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td class="text-right">
                  {{ store.targetcapaian }}
                  <q-popup-edit v-model="store.targetcapaian" v-slot="scope" @update:model-value="(val) => {
                    store.targetcapaian = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
              </tr>
              <tr>
                <td>
                  Masukan
                </td>
                <td>
                  {{ store.masukan }}
                  <q-popup-edit v-model="store.masukan" v-slot="scope" @update:model-value="(val) => {
                    store.masukan = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td class="text-right">
                  <template v-if="store.reqs.jenisrka === '2'">
                    {{ formatRpDouble(store.datarkapergeseran[0].pagu) }}
                  </template>
                  <template v-if="store.reqs.jenisrka === '3'">
                    {{ formatRpDouble(store.datarkaperubahan[0].pagu) }}
                  </template>
                </td>

                <!-- SETELAH PERGESERAN -->
                <td>
                  {{ store.masukan }}
                  <q-popup-edit v-model="store.masukan" v-slot="scope" @update:model-value="(val) => {
                    store.masukan = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td class="text-right">
                  <template v-if="store.reqs.jenisrka === '2'">
                    {{ formatRpDouble(store.datarkapergeseran[0].pagubaru) }}
                  </template>
                  <template v-if="store.reqs.jenisrka === '3'">
                    {{ formatRpDouble(store.datarkaperubahan[0].pagubaru) }}
                  </template>
                </td>
              </tr>
              <tr>
                <td>
                  Keluaran
                </td>
                <td>
                  {{ store.keluaran }}
                  <q-popup-edit v-model="store.keluaran" v-slot="scope" @update:model-value="(val) => {
                    store.keluaran = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td class="text-right">
                  {{ store.targetkeluaran }}
                  <q-popup-edit v-model="store.targetkeluaran" v-slot="scope" @update:model-value="(val) => {
                    store.targetkeluaran = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>

                <!-- SETELAH PERGESERAN -->
                <td>
                  {{ store.keluaran }}
                  <q-popup-edit v-model="store.keluaran" v-slot="scope" @update:model-value="(val) => {
                    store.keluaran = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td class="text-right">
                  {{ store.targetkeluaran }}
                  <q-popup-edit v-model="store.targetkeluaran" v-slot="scope" @update:model-value="(val) => {
                    store.targetkeluaran = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
              </tr>
              <tr>
                <td>
                  Hasil
                </td>
                <td>
                  {{ store.hasil }}
                  <q-popup-edit v-model="store.hasil" v-slot="scope" @update:model-value="(val) => {
                    store.hasil = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td class="text-right">
                  {{ store.targethasil }}
                  <q-popup-edit v-model="store.targethasil" v-slot="scope" @update:model-value="(val) => {
                    store.targethasil = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <!-- SETELAH PERGESERAN -->
                <td>
                  {{ store.hasil }}
                  <q-popup-edit v-model="store.hasil" v-slot="scope" @update:model-value="(val) => {
                    store.hasil = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td class="text-right">
                  {{ store.targethasil }}
                  <q-popup-edit v-model="store.targethasil" v-slot="scope" @update:model-value="(val) => {
                    store.targethasil = val
                  }">
                    <q-input label="Silahkan di isi" v-model="scope.value" dense autofocus counter
                      @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
              </tr>

            </tbody>
          </q-markup-table>
        </div>
      </div>
      <div class="row">
        <div class="full-width">
          <q-markup-table flat bordered wrap-cells :separator="separator">
            <thead>
              <tr>
                <th style="font-weight: bold;" colspan="2">REKENING</th>
                <th style="font-weight: bold;" colspan="4">SEBELUM PERUBAHAN</th>
                <th style="font-weight: bold;" colspan="4">SETELAH PERUBAHAN</th>
              </tr>
              <tr>
                <th style="font-weight: bold;">Kode</th>
                <th style="font-weight: bold;">Uraian</th>
                <th style="font-weight: bold;">Volume</th>
                <th style="font-weight: bold;">Satuan</th>
                <th style="font-weight: bold;">Harga</th>
                <th style="font-weight: bold;">Total</th>
                <th style="font-weight: bold;">Volume</th>
                <th style="font-weight: bold;">Satuan</th>
                <th style="font-weight: bold;">Harga</th>
                <th style="font-weight: bold;">Total</th>
              </tr>
            </thead>
            <tbody v-if="store.reqs.jenisrka === '2'">
              <template v-for="it in store.datarkapergeseran" :key="it">
                <tr>
                  <td class="text-bold text-left q-px-sm"> {{ it.kode }} </td>
                  <td class="text-bold text-left q-px-sm" colspan="4"> {{ it.uraian }} </td>
                  <td class="text-right text-bold">
                    <span class="row justify-between">
                      <span class="col-auto flex-start">Rp. </span>
                      <span class="flex-end text-right q-pr-sm">
                        {{ formattanpaRp(it.pagu) }}
                      </span>
                    </span>
                  </td>
                  <td colspan="3"></td>
                  <td class="text-right text-bold">
                    <span class="row justify-between">
                      <span class="col-auto flex-start">Rp. </span>
                      <span class="flex-end text-right q-pr-sm">
                        {{ formattanpaRp(it.pagubaru) }}
                      </span>
                    </span>
                  </td>
                </tr>
                <template v-for="rinci in it?.rincian" :key="rinci">
                  <tr>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.kode108 }}
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        - {{ rinci.usulan }}
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.volume }}
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.satuan }}
                      </span>
                    </td>
                    <td class="text-right">
                      <span class="row justify-between">
                        <span class="col-auto flex-start">Rp. </span>
                        <span class="flex-end text-right q-pr-sm">
                          {{ formattanpaRp(rinci.harga) }}
                        </span>
                      </span>
                    </td>
                    <td class="text-right">
                      <span class="row justify-between">
                        <span class="col-auto flex-start">Rp. </span>
                        <span class="flex-end text-right q-pr-sm">
                          {{ formattanpaRp(rinci.pagu) }}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.volumebaru }}
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.satuan }}
                      </span>
                    </td>
                    <td class="text-right">
                      <span class="row justify-between">
                        <span class="col-auto flex-start">Rp. </span>
                        <span class="flex-end text-right q-pr-sm">
                          {{ formattanpaRp(rinci.hargabaru) }}
                        </span>
                      </span>
                    </td>
                    <td class="text-right">
                      <span class="row justify-between">
                        <span class="col-auto flex-start">Rp. </span>
                        <span class="flex-end text-right q-pr-sm">
                          {{ formattanpaRp(rinci.pagubaru) }}
                        </span>
                      </span>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
            <tbody v-if="store.reqs.jenisrka === '3'">
              <template v-for="it in store.datarkaperubahan" :key="it">
                <tr>
                  <td class="text-bold text-left q-px-sm"> {{ it.kode }} </td>
                  <td class="text-bold text-left q-px-sm" colspan="4"> {{ it.uraian }} </td>
                  <td class="text-right text-bold">
                    <span class="row justify-between">
                      <span class="col-auto flex-start">Rp. </span>
                      <span class="flex-end text-right q-pr-sm">
                        {{ formattanpaRp(it.pagu) }}
                      </span>
                    </span>
                  </td>
                  <td colspan="3"></td>
                  <td class="text-right text-bold">
                    <span class="row justify-between">
                      <span class="col-auto flex-start">Rp. </span>
                      <span class="flex-end text-right q-pr-sm">
                        {{ formattanpaRp(it.pagubaru) }}
                      </span>
                    </span>
                  </td>
                </tr>
                <template v-for="rinci in it?.rincian" :key="rinci">
                  <tr>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.kode108 }}
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        - {{ rinci.usulan }}
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.volume }}
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.satuan }}
                      </span>
                    </td>
                    <td class="text-right">
                      <span class="row justify-between">
                        <span class="col-auto flex-start">Rp. </span>
                        <span class="flex-end text-right q-pr-sm">
                          {{ formattanpaRp(rinci.harga) }}
                        </span>
                      </span>
                    </td>
                    <td class="text-right">
                      <span class="row justify-between">
                        <span class="col-auto flex-start">Rp. </span>
                        <span class="flex-end text-right q-pr-sm">
                          {{ formattanpaRp(rinci.pagu) }}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.volumebaru }}
                      </span>
                    </td>
                    <td>
                      <span class="q-pl-md">
                        {{ rinci.satuan }}
                      </span>
                    </td>
                    <td class="text-right">
                      <span class="row justify-between">
                        <span class="col-auto flex-start">Rp. </span>
                        <span class="flex-end text-right q-pr-sm">
                          {{ formattanpaRp(rinci.hargabaru) }}
                        </span>
                      </span>
                    </td>
                    <td class="text-right">
                      <span class="row justify-between">
                        <span class="col-auto flex-start">Rp. </span>
                        <span class="flex-end text-right q-pr-sm">
                          {{ formattanpaRp(rinci.pagubaru) }}
                        </span>
                      </span>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-card-section>
  </template>
</template>
<script setup>
import { formatRpDouble, formattanpaRp } from 'src/modules/formatter'
import { useRkaStore } from 'src/stores/siasik/anggaran/storerka'
import { ref } from 'vue'

const store = useRkaStore()
const separator = ref('cell')

</script>
<style>
.custom-table {
  border-collapse: collapse;
}

.custom-table tr,
.custom-table th,
.custom-table td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
