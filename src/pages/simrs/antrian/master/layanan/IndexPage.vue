<template>
  <q-page>
    <div class="q-pa-lg">
      <q-card class="my-card full-width">
        <q-card-section>
          <div class="full-width row justify-between items-center content-between">
            <div class="col-grow">
              <div
                class="flex flex-column items-center flex-center"
              >
                <div class="col text-left">
                  <div class="f-14 text-weight-bold">
                    {{ store.title }}
                  </div>
                  <div class="title-desc">
                    {{ store.subtitle }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <app-table
            id="printMe"
            :columns="store.columns"
            :column-hide="store.columnHide"
            :items="store.items"
            :meta="store.meta"
            :per-page="store.params.per_page"
            :order-by="store.params.order_by"
            :sort="store.params.sort"
            :loading="store.loading"
            :text-size="12"
            :default-btn="true"
            :to-search="store.params.q"
            :ada-tambah="true"
            row-image="image"
            @set-row="store.setPerPage"
            @goto="store.setPage"
            @search="store.enterSearch"
            @find="store.setSearch"
            @refresh="store.refreshTable"
            @new-data="form.addNew()"
            @edit-data="(val)=>form.editData(val)"
            @delete="(id)=>store.deletesData(id)"
          >
            <template #header-left-after-search>
              <div class="q-ml-sm">
                <app-btn
                  label="Sync Simrs & Bpjs"
                  :loading="store.loading"
                  @click="store.synch()"
                />
              </div>
            </template>
            <template #col-nama="{left}">
              <div :class="`${left}`">
                Nama Layanan
              </div>
            </template>
            <template #col-kode="{left}">
              <div :class="`${left}`">
                Kode
              </div>
            </template>

            <template #cell-default-img="{row}">
              <q-avatar
                :color="row.id_layanan <=4 ? 'primary':'negative'"
                text-color="white"
                size="md"
                class="cursor-pointer"
                :class="row.id_layanan <=4 ? 'bg-primary':'bg-negtive'"
              >
                {{ row.id_layanan? row.id_layanan.substring(0,1): 'P' }}
                <!-- <q-menu>
                  <div class="row no-wrap q-pa-md">
                    <div class="column items-center">
                      <div class="text-h6 q-mb-md">
                        Detail Poli
                      </div>
                      <q-avatar
                        :color="row.unit_group ==='Pendaftaran'? 'primary':'negtive'"
                        text-color="white"
                        size="lg"
                        class="cursor-pointer"
                        :class="row.unit_group ==='Pendaftaran'? 'bg-primary':'bg-negtive'"
                      >
                        {{ row.loket.substring(0,1) }}
                      </q-avatar>
                      <div class=" q-mt-md">
                        {{ row.loket }}
                      </div>
                    </div>
                    <q-separator
                      vertical
                      inset
                      class="q-mx-lg"
                    />
                    <div class="column">
                      <div class="f-14 text-weight-bold q-mb-md">
                        Detail Poli BPJS
                      </div>
                      <q-separator class="q-mb-sm" />
                      <div>
                        Kode : <span class="text-weight-bold">{{ row.poli_bpjs? row.poli_bpjs.kode:'-' }}</span>
                      </div>
                      <div>
                        Nama : <span class="text-weight-bold">{{ row.poli_bpjs? row.poli_bpjs.nama:'-' }}</span>
                      </div>
                      <q-separator class="q-my-md" />
                      <div class="f-14 text-weight-bold q-mb-md">
                        Pencarian yang ditemukan Bpjs
                      </div>
                      <q-list
                        v-if="row.referensi_poli_bpjs?.length>0"
                        dense
                        bordered
                        padding
                        class="rounded-borders"
                        separator
                      >
                        <q-item
                          v-for="(item,i) in row.referensi_poli_bpjs"
                          :key="i"
                        >
                          <q-item-section>
                            {{ item.nama }}
                          </q-item-section>
                          <q-item-section side>
                            {{ item.kode }}
                          </q-item-section>
                        </q-item>
                      </q-list>
                      <div v-else>
                        Data tidak ditemukan
                      </div>
                    </div>
                  </div>
                </q-menu> -->
              </q-avatar>
            </template>
          </app-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- dialog form -->
    <app-dialog-form
      ref="formRef"
      v-model="form.dialog"
      :title="form.titleDialog"
      :loading="form.loading"
      @save-form="saveForm(ref)"
    >
      <form-dialog-input />
    </app-dialog-form>
  </q-page>
</template>

<script setup>
import { useMasterLayananStore } from 'src/stores/antrian/master/layanan'
import { useMasterLayananFormStore } from 'src/stores/antrian/master/layanan/form'
import { onMounted, ref } from 'vue'
import FormDialogInput from './FormDialogInput.vue'

const store = useMasterLayananStore()
const form = useMasterLayananFormStore()

const formRef = ref()
// console.log(form)

onMounted(() => {
  store.getDataTable()
})

function saveForm(ref) {
  console.log(ref)
  // console.log(form.form)
  form.saveForm().then(() => {
    store.getDataTable()
    formRef.value.resetForm()
  })
}
</script>
