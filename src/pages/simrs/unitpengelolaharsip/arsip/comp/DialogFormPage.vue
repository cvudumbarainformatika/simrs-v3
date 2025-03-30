<template>
  <q-dialog v-model="store.dialog">
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
              <app-input-date-human :model="store.tanggal.tgl" label="dari tanggal" outlined @db-model="setFrom"
                @set-display="setToFromDisp" />
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
              </q-select>
            </div>
            <div class="col-12">
              <q-input label="No. Arsip" outlined dense />
            </div>
            <div class="col-12">
              <q-input label="No. Arsip" outlined dense />
            </div>
            <div class="col-12">
              <q-input label="No. Arsip" outlined dense />
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

const props = defineProps({
  klasifikasi: {
    type: Object,
    default: null
  },
})

const options = ref([props.klasifikasi])

function filterFn(val, update) {

  console.log(val)
  if (val === "") {
    update(() => {
      options.value = []
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase();
    console.log('sasa', needle)

    options.value = props.klasifikasi.filter(
      (v) =>
        v.nama.toString().toLowerCase().indexOf(needle) > -1 ||
        v.kode.toString().toLowerCase().indexOf(needle) > -1
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
