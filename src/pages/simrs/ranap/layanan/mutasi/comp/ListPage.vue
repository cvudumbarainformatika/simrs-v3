<template>
  <div class="q-pa-md fit scroll">
    <transition-group v-if="store.historys" name="list">
      <q-card flat bordered v-for="(item, i) in filterredTable" :key="i" class="q-mb-xs cursor-pointer"
        :class="{ 'bg-yellow-3': store.isEditted === item?.id }">
        <div class="full-width">
          <q-card-section>
            <q-item class="list-move q-pa-none">
              <q-item-section avatar top>
                <q-icon name="icon-mat-transfer_within_a_station" color="primary"></q-icon>
              </q-item-section>

              <q-item-section>
                <q-item-label caption lines="1" class="text-weight-bold ">
                  Mutasi Dari : <span class="text-primary">{{ item?.nm_ruanglm }}</span>
                </q-item-label>
                <q-item-label lines="1">
                  Tujuan : <span class="text-dark text-weight-bold">{{ item?.nm_ruang }}</span>
                </q-item-label>

                <q-item-label caption lines="1">
                  <span>Pada Tanggal : <span class="text-primary">{{ humanDate(item?.rs2) }}</span></span>

                </q-item-label>

                <q-item-label>
                  Alasan : <span class="text-primary">{{ item?.alasan }}</span>
                </q-item-label>
                <!-- <q-item-label>
                  <q-badge color="orange-9" text-color="white">
                    Blm Ada Dokumen Serah Terima
                  </q-badge>
                </q-item-label> -->
              </q-item-section>

              <q-item-section side>
                <div class="absolute-top-right">
                  {{ jamTnpDetik(item?.rs2) }}
                </div>
                <div class="absolute-bottom-right">
                  <q-btn flat round color="primary" icon="icon-mat-edit" @click="editData(item)"></q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-card-section>

        </div>

      </q-card>
    </transition-group>
    <div style="margin-bottom: 100px;" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatRp, humanDate, tglJamFormat, jamTnpDetik } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  auth: {
    type: String,
    default: null
  },
  nakes: {
    type: String,
    default: null
  },
  store: {
    type: Object,
    default: null
  }
})

const body = ref('lorem ipsum')

const filterredTable = computed(() => {
  return props.store?.historys
})

function editData(item) {
  // console.log('item', item)
  props.store?.initForm(item)
}

</script>