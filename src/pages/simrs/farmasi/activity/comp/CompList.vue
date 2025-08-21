<template>
  <div class="row">
    <app-table title="any" :columns="store.columns" :column-hide="store.columnHide" :items="store.items"
      :meta="store.meta" :per-page="store.params.per_page" :order-by="store.params.order_by" :sort="store.params.sort"
      :loading="store?.loading" :to-search="store.params.q" :default-btn="false" :ada-paginasi="false" :ada-cari="false"
      :ada-refresh="false" :ada-per-page="false" :ada-filter="false" :ada-tambah="false" :right-col="false">
      <template #col-action>
        <div>Model Action</div>
      </template>
      <template #col-description>
        <div>Deskripsi</div>
      </template>

      <template #cell-description="{ row }">
        <template v-if="isJSON(row.description)">
          <div class="row full-width text-weight-bold">
            <div class="col-6">
              Original
            </div>
            <div class="col-3">
              Before
            </div>
            <div class="col-3">
              After
            </div>
          </div>
          <div class="row full-width">
            <div class=" col-4">
              <template v-if="desc(row.description)?.original">
                <div v-for="item in getKeys(desc(row.description)?.original)" :key="item" class="row">
                  <div class="col-4">{{ item }}</div>
                  <div class="col-8">{{ item == 'created_at' || item == 'updated_at' ? dateFull(
                    desc(row.description)?.original[item]) : desc(row.description)?.original[item] }}</div>
                </div>
              </template>
            </div>
            <div class="col-4">
              <template v-if="desc(row.description)?.before">
                <div v-for="item in getKeys(desc(row.description)?.before)" :key="item" class="row">
                  <div class="col-4">{{ item }}</div>
                  <div class="col-8">{{ item == 'created_at' || item == 'updated_at' ? dateFull(
                    desc(row.description)?.before[item]) : desc(row.description)?.before[item] }}</div>
                </div>
              </template>
            </div>
            <div class="col-4">
              <template v-if="desc(row.description)?.after">
                <div v-for="item in getKeys(desc(row.description)?.after)" :key="item" class="row">
                  <div class="col-4">{{ item }}</div>
                  <div class="col-8">{{ item == 'created_at' || item == 'updated_at' ? dateFull(
                    desc(row.description)?.after[item]) : desc(row.description)?.after[item] }}</div>
                </div>
              </template>
            </div>
          </div>
          <div class="row q-pt-md">
            {{ row.source }}
          </div>
        </template>
        <template v-else>
          <div class="row full-width">{{ row.description }}</div>
        </template>

      </template>


    </app-table>
  </div>
</template>
<script setup>
import { dateFull } from 'src/modules/formatter'
import { useLogActivityFarmasiStore } from 'src/stores/simrs/farmasi/activity/activity'

const store = useLogActivityFarmasiStore()

function desc (val) {
  if (isJSON(val)) {
    return JSON.parse(val)
  }
  else return val
}
function getKeys (val) { return Object.keys(val) }
function isJSON (str) {
  if (typeof str !== "string") return false
  str = str.trim()
  if (!(str.startsWith("{") || str.startsWith("["))) return false

  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

</script>
