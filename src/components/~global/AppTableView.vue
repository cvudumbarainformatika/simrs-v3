<template>
  <div class="app-table f-12">
    <div class="print-only">
      <slot
        name="header-for-print"
      />
    </div>
    <!-- title option table -->
    <div class="flex items-center justify-between q-mb-md print-hide">
      <!-- title -->
      <div class="col-one flex items-center">
        <div class="title-table q-pr-sm f-14 text-bold">
          {{ title }}
        </div>
        <div class="q-pl-sm">
          <q-input
            v-if="adaCari"
            v-model="search"
            class="search-big"
            borderless
            debounce="500"
            clearable
            dense
            placeholder="Search..."
            clear-icon="icon-mat-close"
          >
            <template #prepend>
              <q-icon
                name="icon-mat-search"
                size="20px"
              />
            </template>
          </q-input>
        </div>
        <slot
          name="header-left-after-search"
          class="q-ml-md"
        />
      </div>
      <div class="col-one">
        <!-- delete Ids -->
        <q-btn
          v-if="selected?.length > 0"
          unelevated
          color="red"
          round
          size="sm"
          icon="icon-mat-delete_sweep"
          @click="deleteData()"
        >
          <q-tooltip
            class="primary"
            :offset="[10, 10]"
          >
            Hapus Data
          </q-tooltip>
        </q-btn>
        <!-- refresh Ids -->
        <q-btn
          v-if="adaRefresh"
          unelevated
          round
          size="sm"
          icon="icon-mat-refresh"
          @click="emits('refresh')"
        >
          <q-tooltip
            class="primary"
            :offset="[10, 10]"
          >
            Refresh Table
          </q-tooltip>
        </q-btn>
        <!-- per page -->
        <q-btn
          class="q-ml-sm"
          unelevated
          color="orange"
          round
          size="sm"
          icon="icon-mat-layers"
        >
          <q-tooltip
            class="primary"
            :offset="[10, 10]"
          >
            Filter Table
          </q-tooltip>
          <q-menu
            transition-show="flip-left"
            transition-hide="flip-right"
            class="q-pt-sm"
            anchor="top left"
            self="top right"
          >
            <q-list>
              <q-item
                v-for="(opt, i) in options"
                :key="i"
                v-ripple
                tag="label"
              >
                <q-item-section>
                  <q-radio
                    v-model="selectPerPage"
                    size="xs"
                    :val="opt"
                    :label="opt + ' Baris'"
                    color="primary"
                  />
                </q-item-section>
                <q-item-label />
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- filter table -->
        <q-btn
          v-if="adaFilter"
          class="q-ml-sm"
          unelevated
          color="indigo"
          round
          size="sm"
          icon="icon-mat-sort"
        >
          <q-tooltip
            class="primary"
            :offset="[10, 10]"
          >
            Filter Table
          </q-tooltip>
          <q-menu
            transition-show="flip-left"
            transition-hide="flip-right"
            class="q-pt-sm"
          >
            <q-list style="min-width: 131px">
              <q-item
                v-for="(head, index) in filterCheckbox"
                :key="index"
                v-ripple
                tag="label"
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="selectColumn"
                    size="sm"
                    dense
                    :val="head"
                    color="primary"
                  />
                </q-item-section>
                <q-item-section>{{ head }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- data baru -->
        <q-btn
          v-if="adainput"
          class="q-ml-sm"
          unelevated
          round
          color="primary"
          size="sm"
          icon="icon-mat-add"
          @click="emits('newData')"
        >
          <q-tooltip
            class="primary"
            :offset="[10, 10]"
          >
            Data Baru
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-separator />
    <!-- table -->
    <q-markup-table
      ref="refCellTable"
      dense
      flat
      bordered
      separator="horizontal"
      class=""
    >
      <thead>
        <tr>
          <th
            v-if="isChecked"
            width="5%"
            class="text-left"
          >
            <div>
              <q-checkbox
                v-model="checkAll"
                size="xs"
                keep-color
                color="cyan"
              />
            </div>
          </th>
          <th
            v-if="rowImage !== null"
            width="5%"
            class="text-left"
          >
            <div class="">
              image
            </div>
          </th>
          <th
            v-for="(head, index) in filterColumn"
            :key="index"
            class="text-left cursor-pointer"
            @click="emits('setOrder', head)"
          >
            <div class="flex items-center">
              <slot
                :name="'col-' + head"
                :row="head"
              >
                <div class="bold">
                  {{ head }}
                </div>
              </slot>
              <div v-if="orderBy === head">
                <q-icon
                  v-if="sort === 'desc'"
                  class="q-ml-xs"
                  name="icon-mat-vertical_align_bottom"
                />
                <q-icon
                  v-else
                  class="q-ml-xs"
                  name="icon-mat-vertical_align_top"
                />
              </div>
            </div>
          </th>
          <th class="text-right">
            <div class="">
              #
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-if="!items?.length > 0">
          <!-- <transition
            transition-show="fade"
            transition-hide="fade"
          > -->
          <td
            :colspan="
              rowImage === null
                ? filterColumn?.length + 2
                : filterColumn?.length + 3
            "
          >
            <div
              class="flex column flex-center bg-loading-bg__table"
              style="height: 300px"
            >
              <div>
                <q-icon
                  name="icon-mat-receipt_long"
                  color="primary"
                  size="60px"
                />
              </div>
              <div class="text-primary q-mt-sm">
                Data Belum Ada
              </div>
            </div>
          </td>
          <!-- </transition> -->
        </tr>
        <tr
          v-for="(item, i) in items"
          v-else
          :key="i"
          class="text-left"
        >
          <td v-if="isChecked">
            <q-checkbox
              v-model="selected"
              size="xs"
              keep-color
              :val="item.id"
              color="teal"
            />
          </td>
          <td
            v-if="rowImage !== null"
            class="text-left"
          >
            <q-avatar size="30px">
              <img src="~assets/images/user-avatar.svg">
            </q-avatar>
          </td>
          <td
            v-for="(col, idx) in filterColumn"
            :key="idx"
            width="10%"
            class="text-left"
          >
            <slot
              :name="'cell-' + col"
              :row="item"
            >
              {{ item[col] }}
            </slot>
          </td>
          <td class="text-right">
            <div class="row fit no-wrap">
              <q-btn
                v-if="bisaEdit"
                flat
                class=""
                size="sm"
                round
                color="grey"
                icon="icon-mat-edit"
                @click="emits('editData', item)"
              >
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                >
                  Edit Data
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="adaDetail"
                flat
                class=""
                size="sm"
                round
                color="grey"
                icon="icon-mat-visibility"
                @click="emits('detail', item)"
              >
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                >
                  Lihat Details
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="selected?.length < 2 && bisaDelete"
                flat
                class=""
                size="sm"
                round
                color="grey"
                icon="icon-mat-delete_sweep"
                @click="deleteOne(item.id)"
              >
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                >
                  Delete Data
                </q-tooltip>
              </q-btn>
              <slot
                name="left-action"
                class="q-ml-md"
                :row="item"
                :index="i"
              />
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td
            :colspan="
              rowImage === null
                ? filterColumn?.length + 2
                : filterColumn?.length + 3
            "
          >
            <div
              class="flex column flex-center bg-loading-bg__table"
              style="height: 400px"
            >
              <div>
                <q-spinner-cube
                  color="primary"
                  size="40px"
                />
              </div>
              <div class="text-primary q-mt-sm">
                harap bersabar, menunggu...
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <!-- Pagination -->
    <AppPaginationTable
      v-if="items?.length > 0 && paginasi"
      :meta="meta"
      @first="emits('goto', 1)"
      @last="emits('goto', meta.last_page)"
      @next="emits('goto', meta.current_page + 1)"
      @prev="emits('goto', meta.current_page - 1)"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const props = defineProps({
  title: { type: String, default: 'Title' },
  loading: { type: Boolean, default: false },
  columns: { type: Array, default: () => [] },
  columnHide: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  meta: { type: Object, default: () => { } },
  rowImage: { type: String, default: null },
  perPage: { type: Number, default: 5 },
  orderBy: { type: String, default: 'id' },
  sort: { type: String, default: 'desc' },
  toSearch: { type: String, default: '' },
  isChecked: { type: Boolean, default: false },
  bisaEdit: { type: Boolean, default: false },
  bisaDelete: { type: Boolean, default: false },
  adainput: { type: Boolean, default: false },
  adaDetail: { type: Boolean, default: false },
  paginasi: { type: Boolean, default: true },
  adaCari: { type: Boolean, default: true },
  adaRefresh: { type: Boolean, default: true },
  adaFilter: { type: Boolean, default: true }

})
const emits = defineEmits([
  'newData',
  'editData',
  'goto',
  'deleteIds',
  'setRow',
  'setColumns',
  'setOrder',
  'find',
  'delete',
  'refresh',
  'detail'
])
// const per_page = ref(5)
const refCellTable = ref(null)
const options = ref([5, 10, 20, 50, 100])
const checkAll = ref(false)
const selected = ref([])
const selectPerPage = computed({
  get () {
    return props.perPage
  },
  set (val) {
    emits('setRow', val)
  }
})
const search = computed({
  get () {
    return props.toSearch
  },
  set (newVal) {
    emits('find', newVal)
  }
})
const filterColumn = computed(() => {
  const cols = props.columns ? props.columns : []
  if (cols?.length > 0) {
    const filterred = cols.filter((el) => !props.columnHide.includes(el))
    if (selectColumn.value?.length > 0) {
      const thumb = filterred.filter((el) => selectColumn.value.includes(el))
      return thumb
    }
    return filterred
  }
  return cols
})
const filterCheckbox = computed(() => {
  const cols = props.columns ? props.columns : []
  if (cols?.length > 0) {
    return cols.filter((el) => !props.columnHide.includes(el))
  }
  return cols
})
const selectColumn = ref([])
const heightCell = ref(0)
// actions
onMounted(() => {
  // console.log(props.columns)
  heightCell.value = refCellTable.value.$el.clientHeight * props.perPage
  //   console.log(refCellTable.value.$el.clientHeight * props.perPage)
})
watch(filterCheckbox, (obk) => {
  for (let i = 0; i < obk?.length; i++) {
    selectColumn.value.push(obk[i])
  }
})
watch(checkAll, () => {
  setCheck(checkAll.value)
})
watch(selectColumn, () => {
  setCheck(checkAll.value)
})
watch(
  () => props.items,
  (obj) => {
    //   console.log('Watch items', obj)
    selected.value = []
  }
)
const setCheck = (x) => {
  const arr = []
  if (x) {
    for (let i = 0; i < props.items?.length; i++) {
      arr.push(props.items[i].id)
    }
    selected.value = arr
  }
  else {
    selected.value = []
  }
}
function deleteData () {
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true
    // persistent: true
  })
    .onOk(() => {
      // const params = { id: selected.value }
      emits('deleteIds', selected.value)
    })
    .onCancel(() => {
      console.log('Cancel')
      selected.value = []
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}
// function deleteOne (id) {
//   $q.dialog({
//     title: 'Peringatan',
//     message: 'Apakah Data ini akan dihapus?',
//     cancel: true
//     // persistent: true
//   })
//     .onOk(() => {
//       // const params = { id: selected.value }
//       emits('delete', id)
//     })
//     .onCancel(() => {
//       console.log('Cancel')
//       selected.value = []
//     })
//     .onDismiss(() => {
//       // console.log('I am triggered on both OK and Cancel')
//     })
// }
</script>

<style lang="scss" scoped>
.q-table th,
.q-table td {
  padding: 5px !important;
}
.q-table--no-wrap th, .q-table--no-wrap td {
  white-space: normal !important;
}
</style>
