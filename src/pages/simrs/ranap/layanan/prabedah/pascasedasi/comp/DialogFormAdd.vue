<template>
  <q-dialog v-model="isOpen" persistent position="right" full-height>
    <q-card style="width: calc(100vw - 300px); max-width: 85vw; min-width: 75vw;" class="full-height bg-grey-3 column">
      <!-- HEADER MODAL -->
      <q-card-section class="col-auto bg-primary text-white q-py-sm row justify-between items-center z-top shadow-2">
        <div class="text-subtitle1 text-bold flex items-center">
          <q-icon name="icon-mat-add_task" size="24px" class="q-mr-sm" />
          Formulir Asesmen Status Sedasi Pasien
        </div>
        <q-btn flat round dense icon="icon-mat-close" v-close-popup color="white" />
      </q-card-section>

      <!-- FORM CONTENT BODY WITH SMOOTH SCROLL -->
      <q-card-section class="col full-height scroll q-pa-none">
        <FormPage :pasien="pasien" :kasus="kasus" :nakes="nakes" @on-saved="isOpen = false" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import FormPage from './FormPage.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
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

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
