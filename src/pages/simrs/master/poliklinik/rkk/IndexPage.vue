<template>
  <q-page class="column full-height" style="overflow: hidden;">
    <q-card flat square class="col column q-ma-sm full-height">

      <!-- <q-separator /> -->
      <div class="col-grow full-height relative-position">
        <div class="absolute full-width full-height">
          <div class="row full-height">
            <div class="col-5 full-height scroll q-pa-sm">
              <div class="q-px-sm text-weight-bold">
                Form Master RKK
                <q-separator class="q-my-sm" />
              </div>
              <FormInput />
            </div>

            <div class="col-7 full-height bg-grey scroll q-pa-sm">
              <ListDiagnosa :lists="store.items" @edit="(val) => store.editForm(val)"
                @delete="(val) => hapusDiagnosa(val)" @set-intervensi="store.setIntervensi" />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useMasterRkkStore } from 'src/stores/simrs/master/poliklinik/rkk'
import FormInput from './FormInput.vue'
// import FormIntevensi from './FormIntevensi.vue'
import ListDiagnosa from './ListDiagnosa.vue'
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'

const store = useMasterRkkStore()
const $q = useQuasar()

onMounted(() => {
  store.getData()
})

function hapusDiagnosa(id) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // console.log('HAPUS', id)
    store.deleteItem(id)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

</script>
