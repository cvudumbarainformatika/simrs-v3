<template>
  <div class="bg-black column no-wrap window-height window-width overflow-hidden">
    <q-bar class="col-auto bg-dark text-white">
      <div>Viewer Radiologi</div>

      <q-space />

      <q-btn
        flat
        dense
        color="negative"
        icon="close"
        label="Tutup"
        @click="closeWindow"
      />
    </q-bar>

    <div class="col relative-position overflow-hidden full-width">
      <iframe
        v-if="url"
        :src="url"
        style="
          width: 100%;
          height: 100%;
          border: none;
        "
        allowfullscreen
        frameborder="0"
      />
      <div v-else class="flex flex-center text-white full-height">
        URL PACS tidak ditemukan.
      </div>

      <!-- overlay penutup tombol back orthanc -->
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
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const url = ref(null)

onMounted(() => {
  const k = route.query.k
  if (k) {
    url.value = sessionStorage.getItem('pacs_' + k) || localStorage.getItem('pacs_' + k)
    if (url.value) {
      sessionStorage.setItem('last_pacs_url', url.value)
    }
  }

  // Fallback jika query url disertakan langsung
  if (!url.value && route.query.url) {
    try {
      url.value = decodeURIComponent(route.query.url)
    } catch (e) {
      url.value = route.query.url
    }
    if (url.value) {
      sessionStorage.setItem('last_pacs_url', url.value)
    }
  }

  // Fallback jika tab di-refresh
  if (!url.value) {
    url.value = sessionStorage.getItem('last_pacs_url')
  }

  // Hapus query string dari address bar browser agar URL orthanc tidak terlihat sama sekali
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }
})

function closeWindow() {
  window.close()
}
</script>
