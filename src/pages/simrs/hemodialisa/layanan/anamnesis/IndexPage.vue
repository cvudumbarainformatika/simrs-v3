<template>
  <div class="fit q-pa-xs">
    <!-- <div class="col"> -->
    <div class="row q-col-gutter-xs fit">
      <div :class="`${full ? 'col-12' : 'col-8'} full-height`">
        <div class="fit bg-white column">
          <div class="col-auto">
            <BarComp title="ANAMNESSE" bg-color="bg-primary" text-color="text-white" :fullpage="full"
              @full="full = !full" />
            <q-separator />
          </div>
          <div class="col full-height scroll">
            <q-form ref="myForm" class="q-pa-md">
              <FormAnamnesis ref="formRef" :pasien="props.pasien" :kasus="props.kasus" :key="pasien" />
              <q-separator class="q-my-md" />
              <div class="flex justify-end">
                <q-btn :loading="store.loadingSave" :disable="store.loadingSave" type="button" color="primary"
                  label="Simpan" @click="validate" />
              </div>
              <div style="margin-bottom: 100px;" />
            </q-form>
          </div>
        </div>
      </div>
      <div v-if="!full" class="full-height col-4 relative-position">
        <q-card flat bordered class="fit column bg-transparent">
          <div class="col-auto">
            <BarComp title="Informasi Anamnesis" bg-color="bg-dark" text-color="text-white" :btn-full="false" />
          </div>
          <div class="col full-height scroll">
            <RightPage :pasien="pasien" :kasus="kasus" :key="pasien" />
          </div>
        </q-card>
        <!-- <div class="column fit">
          <div class="col-auto">
            <BarComp title="Informasi" bg-color="bg-dark" text-color="text-white" :btn-full="false" />
          </div>
          <div class="col full-height">
            <RightPage :pasien="pasien" :kasus="kasus" :key="pasien" />
          </div>
        </div> -->
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { scroll } from 'quasar'
import { useAnamnesisHemodialisaStore } from 'src/stores/simrs/hemodialisa/anamnesis'
const { getScrollTarget, setVerticalScrollPosition } = scroll

const BarComp = defineAsyncComponent(() => import('./comp/BarComp.vue'))
const FormAnamnesis = defineAsyncComponent(() => import('./FormAnamnesis.vue'))
const RightPage = defineAsyncComponent(() => import('./RightPage.vue'))

const store = useAnamnesisHemodialisaStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const formRef = ref(null)
const myForm = ref(null)

const full = ref(false)

// console.log('props', props.pasien);


const validate = () => {
  // console.log(formRef.value?.refInputKu)

  myForm.value.validate().then(success => {
    if (success) {
      // yay, models are correct
      // console.log('success')
      store.saveForm(props?.kasus, props.pasien, 'awal')
    }
    else {
      // oh no, user has filled in
      // at least one invalid value
      console.log('failed')
      formRef.value?.refInputKu.focus()
      scrollToElement(formRef.value?.refInputKu.$el)
    }
  })
}

// eslint-disable-next-line no-unused-vars
function scrollToElement (el) {
  const target = getScrollTarget(el)
  // console.log('target', target)

  const offset = el.offsetTop
  // console.log('offset', offset)

  const duration = 200
  setVerticalScrollPosition(target, offset, duration)
}
</script>
