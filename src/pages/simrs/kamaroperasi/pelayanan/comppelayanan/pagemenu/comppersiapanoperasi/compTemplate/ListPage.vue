<template>
  <div class="col-grow bg-teal text-white q-pa-sm">
    <q-bar class=" bg-teal text-white">
      <div class="q-ma-sm f-14 ">
        List Template
      </div>
      <q-space />
      <q-input dense v-model="store.params.q" placeholder="Search" class="q-ma-sm" style="width: 300px;" outlined
        standout="bg-yellow-3" bg-color="white" @update:model-value="store.cariList()" debounce="800"
        :loading="store.loadingCari" />
    </q-bar>
  </div>
  <div style="height: 80vh;">
    <q-scroll-area style="height: 100%; padding-bottom: 60px;">
      <q-list separator bordered>
        <template v-if="store.items?.length">
          <q-expansion-item q-item v-for="(item, i) in store.items" :key="i">
            <template v-slot:header>
              <q-item-section style="width: 80%;">
                <div class="row">
                  <div class="col-3 text-weight-bold">
                    {{ item?.nama }}
                  </div>
                  <div class="col-3 text-primary">
                    {{ item?.pegawai?.nama }}
                  </div>
                  <div class="col-3" :class="item?.sistembayar == '1' ? 'text-primary' : 'text-orange'">
                    {{ item?.sistembayar == '1' ? 'BPJS' : 'Non-BPJS' }}
                  </div>
                  <div class="col-3" :class="item?.user == 'private' ? 'text-primary' : 'text-orange'">
                    {{ item?.user == 'private' ? 'Saya Saja' : 'Semua' }}
                  </div>
                </div>
              </q-item-section>
              <q-item-section side style="width:20%">
                <div class="row items-center q-col-gutter-sm justify-end full-width">

                  <div class="col-shrink text-right">
                    <q-btn color="primary" dense flat no-caps size="xs" icon="icon-mat-edit"
                      :disable="item.loading || store.loadingkirim" :loading="item.loading"
                      @click="store.item.edit = true">
                      <q-tooltip class="bg-white text-primary">
                        Edit
                      </q-tooltip>
                    </q-btn>
                    <q-btn color="dark" dense no-caps size="xs" label="Kirim"
                      :disable="item.loading || store.loadingkirim" :loading="item.loading"
                      @click="store.item.edit = true">
                      <q-tooltip class="bg-white text-primary">
                        Kirim Template ke Depo
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <div v-for="(det, j) in item?.rinci" :key="j">
                  <div class="row items-center  full-width">
                    <div style="width: 5%;">{{ j + 1 }}</div>
                    <div style="width: 40%;">{{ det?.obat?.nama_obat }}</div>
                    <div style="width: 30%;">{{ det?.jumlah }}</div>

                  </div>
                </div>

              </q-card-section>
            </q-card>
          </q-expansion-item>
          <!-- <q-item v-for="(item, i) in store.items" :key="i">

            <q-item-section style="width: 50%;">
              <div class="row">
                {{ item?.nama }}
              </div>
              <div class="row text-italic f-10">
                {{ item?.kd_obat }}
              </div>
            </q-item-section>
            <q-item-section side style="width:50%">
              <div class="row items-center q-col-gutter-sm full-width">
                <div class="text-right col-3">
                  {{ item?.jumlah }}
                </div>
                <div class="col text-right">

                </div>
                <div class="col-shrink text-right">
                  <q-btn color="primary" dense flat no-caps size="xs" icon="icon-mat-edit"
                    :disable="item.loading || store.loadingkirim" :loading="item.loading"
                    @click="store.item.edit = true">
                    <q-tooltip class="bg-white text-primary">
                      Edit
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-item-section>
          </q-item> -->
        </template>
      </q-list>
      <div class="q-mt-lg" />
    </q-scroll-area>
  </div>
</template>
<script setup>
import { useTemplatePersiapanOperasiStore } from 'src/stores/simrs/farmasi/kamaroperasi/template'


const store = useTemplatePersiapanOperasiStore()
function setTemplate (val) {
  console.log('val', val)
  store.item = val
  if (store.item.edit) delete store.item.edit

}
</script>
