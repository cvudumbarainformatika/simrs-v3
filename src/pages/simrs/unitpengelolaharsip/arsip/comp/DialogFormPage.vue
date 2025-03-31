<template>
  <q-dialog v-model="store.dialog" :backdrop-filter="backdropFilter">
    <q-card>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Entry Data Arsip</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <div class=" q-gutter-sm">
          <div class="row q-gutter-sm">
            <div class="col-12">
              <q-input label="No. Arsip" outlined dense />
            </div>
            <div class="col-12">
              <app-input-date-human v-model="store.form.tgl" :model="store.tanggal.tgl" label="dari tanggal" outlined
                @db-model="setFrom" @set-display="setToFromDisp" />
            </div>
            <div class="col-12">
              <q-select v-model="store.from.kodekelasifikasi" label="Kode Klasifikasi" outlined dense :options="options"
                use-input option-label="nama" option-value="kode" clearable emit-value map-options @filter="filterFn">
                <template #option="scope">
                  <q-item v-bind="scope.itemProps"><q-item-section avatar>
                      <q-item-label>
                        <span class="text-bold">{{ scope.opt.kode }} </span><br />
                        <span>{{ scope.opt.nama }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Data Tidak Ditemukan....
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12">
              <q-input type="textarea" v-model="store.form.uraian" label="Uraian" outlined />
            </div>
            <div class="col-12">
              <q-input label="Lokasi Arsip" outlined dense />
            </div>
            <div class="col-12">
              <q-select label="Jenis Media" v-model="store.form.media" outlined dense :options="optionsmedia" use-input
                option-label="nama_media" option-value="id" clearable emit-value map-options @filter="filterFnmedia">
                <template #option="scope">
                  <q-item v-bind="scope.itemProps"><q-item-section avatar>
                      <q-item-label>
                        <span class="text-bold">{{ scope.opt.nama_media }} </span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Data Tidak Ditemukan....
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12">
              <q-option-group v-model="store.form.keaslian" :options="keaslian" color="primary" inline dense />
            </div>
            <div class="col-12">
              <q-input label="Jumlah" outlined dense />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Decline" color="primary" v-close-popup />
        <q-btn flat label="Accept" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>
<script setup>
import { useUnitPengelolahArsipStore } from 'src/stores/simrs/unitpengelolaarsip/arsip';
import { ref } from 'vue';

const store = useUnitPengelolahArsipStore()
const backdropFilter = ref('blur(4px)')

const props = defineProps({
  klasifikasi: {
    type: Object,
    default: null
  },
  media: {
    type: Object,
    default: null
  },
})

const keaslian = ref([
  { label: 'Copy', value: 'Copy' },
  { label: 'Asli', value: 'Asli' }
])

const options = ref([props.klasifikasi])

function filterFn(val, update) {

  if (val === "") {
    update(() => {
      options.value = []
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase();

    options.value = props.klasifikasi.filter(
      (v) =>
        v.nama.toString().toLowerCase().indexOf(needle) > -1 ||
        v.kode.toString().toLowerCase().indexOf(needle) > -1
    );
  });
}

const optionsmedia = ref([props.media])

function filterFnmedia(val, update) {

  if (val === "") {
    update(() => {
      optionsmedia.value = []
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase();

    optionsmedia.value = props.media.filter(
      (v) =>
        v.nama_media.toString().toLowerCase().indexOf(needle) > -1
    );
  });
}

function setFrom(val) {
  store.from.tglbuat = val
}

function setToFromDisp(vaal) {
  store.tanggal.tgl = vaal
}
</script>
