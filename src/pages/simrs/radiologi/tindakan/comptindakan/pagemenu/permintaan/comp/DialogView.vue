<template>
  <q-dialog maximized persistent transition-show="slide-up" transition-hide="slide-down">
    <q-card class="bg-black">
      <q-bar class="bg-dark text-white">
        <div>Viewer Radiologi</div>

        <q-space />

        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-card-section class="q-pa-none fit">
        <iframe :src="viewerUrl" style="
              width: 100%;
              height: calc(100vh - 32px);
              border: none;
            " allowfullscreen frameborder="0">


        </iframe>

        <!-- overlay -->
        <div class="absolute" style="
            top: 5px;
            left: 5px;
            width: 38px;
            height: 40px;
            background: #091b3a;
            z-index: 9999;
            border-radius: 8px;
          " />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>

const props = defineProps({

  viewerUrl: {
    type: String,
    default: null
  }
})
</script>