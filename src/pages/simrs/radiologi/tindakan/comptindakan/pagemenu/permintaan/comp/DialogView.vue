<template>
  <q-dialog
    v-bind="$attrs"
    maximized
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    @before-show="handleOpen"
  >
    <q-card class="bg-black column no-wrap" style="height: 100vh; max-height: 100vh; overflow: hidden;">
      <q-bar class="col-auto bg-dark text-white">
        <div>Viewer Radiologi</div>

        <q-space />

        <q-btn
          flat
          dense
          color="white"
          icon="open_in_new"
          label="Buka di Tab Baru"
          class="q-mr-sm"
          @click="openNewTab"
        />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-card-section class="col q-pa-none relative-position overflow-hidden full-width">
        <iframe
          :src="viewerUrl"
          style="
            width: 100%;
            height: 100%;
            border: none;
          "
          allowfullscreen
          frameborder="0"
        />

        <!-- overlay -->
        <div
          class="absolute"
          style="
            top: 5px;
            left: 5px;
            width: 38px;
            height: 40px;
            background: #091b3a;
            z-index: 9999;
            border-radius: 8px;
          "
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { openPacsViewer } from 'src/modules/utils'

const router = useRouter()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  viewerUrl: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

function openNewTab() {
  if (props.viewerUrl) {
    openPacsViewer(props.viewerUrl, router)
  }
}

function handleOpen() {
  if (props.viewerUrl) {
    openNewTab()
    emit('update:modelValue', false)
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    handleOpen()
  }
})
</script>