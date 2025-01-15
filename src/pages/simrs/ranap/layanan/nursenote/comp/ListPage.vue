<template>
  <div class="fit ">
    <template v-if="wip">
      <div class="column full-height flex-center bg-primary text-white">
        <div class="f-22 text-bold">MAAF ... MENU INI MASIH TAHAP PENGERJAAN</div>
        <div class="f-22 text-bold">...</div>
        <div class="f-22 text-bold">MOHON DIABAIKAN TERLEBIH DAHULU</div>
      </div>
    </template>
    <template v-else>
      <div v-if="!store.items.length" class="column full-height flex-center ">
        <div>Belum Ada Data Tersimpan ... 📋</div>
      </div>
      <div v-else class="q-py-md column full-height scroll">
        <q-card v-for="item in store.items" :key="item?.id" class="q-mx-sm q-mb-sm" flat bordered>
          <q-list bordered class="rounded-borders">
            <q-expansion-item>
              <template #header>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    <!-- {{ titleAvatar(item?.nakes) }} -->
                    as
                  </q-avatar>
                </q-item-section>

                <q-item-section caption>
                  <!-- <div class="">
                    <span class="text-weight-bold">PPA</span> <span class="text-weight-medium">- {{ item?.petugas?.nama
                      }}</span>
                  </div> -->
                </q-item-section>

                <q-item-section side>
                  <div class="flex q-gutter-lg items-center">
                    <!-- <div v-if="auth?.user?.pegawai?.kdpegsimrs === item?.user">
                      <q-btn round flat size="sm" icon="icon-mat-delete" color="negative" @click="deleteItem(item)">
                        <q-tooltip> Hapus </q-tooltip>
                      </q-btn>
                    </div> -->
                    <!-- <div>
                      <div class="text-grey-8">
                        <span class="text-weight-bold">Tgl</span> <em class="text-weight-medium"> {{
                          dateFullFormat(item?.tgl) }}</em>
                      </div>
                      <div class="text-grey-8 q-mt-xs">
                        <q-badge class="q-px-sm q-py-xs" outline color="primary">
                          <div class="flex q-gutter-sm">
                            <div class="">
                              Jam
                            </div>
                            <div>:</div>
                            <div class="text-weight-bold">
                              {{ jamTnpDetik(item?.tgl) }}
                            </div>
                          </div>
                        </q-badge>
                      </div>
                    </div> -->
                  </div>
                </q-item-section>
              </template>

              <q-card bordered flat class="bg-grey-4">
                <div class="q-pa-md">
                  ISInYA
                </div>
              </q-card>
            </q-expansion-item>

            <q-separator />
          </q-list>
        </q-card>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useNurseNoteRanapStore } from 'src/stores/simrs/ranap/nursenote';
import { ref } from 'vue';

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  }
})

const store = useNurseNoteRanapStore()
const wip = ref(false)

</script>