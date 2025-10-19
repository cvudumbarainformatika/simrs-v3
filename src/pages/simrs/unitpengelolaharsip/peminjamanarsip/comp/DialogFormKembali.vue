<template>
  <q-dialog v-model="store.dialogkembali" :backdrop-filter="backdropFilter" transition-show="flip-down"
    transition-hide="flip-up">
    <q-card>
      <q-form ref="refForm" @submit="onSubmit">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Form Pengembalian Arsip</div>
        </q-card-section>
        <q-separator />
        <q-card-section align="center" class="full-height full-width ">
          <div>
            <div class="row">
              <div class="col-12">
                <q-input type="textarea" v-model="store.formkembali.keterangan" label="Keterangan" outlined
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn color="red" label="Simpan" tooltip="Simpan Data" type="submit" tip :loading="store.loadingForm" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useUnitPengelolaharsippeminjamanStore } from 'src/stores/simrs/unitpengelolaarsip/peminjamanarsip';
import { ref } from 'vue';

const store = useUnitPengelolaharsippeminjamanStore()
const backdropFilter = ref('blur(4px)')

function onSubmit() {
  store.saveDataKembali()
}
</script>
