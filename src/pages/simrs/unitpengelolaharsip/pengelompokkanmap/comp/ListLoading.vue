<template>
  <div class="row q-mt-sm q-ml-sm q-col-gutter-md justify-center items-center">
    <div v-for="n in count" :key="n" class="col-auto">
      <q-card flat bordered class="cursor-pointer column items-center justify-center q-pa-md folder-card">
        <!-- Icon folder skeleton -->
        <q-skeleton type="QAvatar" size="56px" square animation="fade" />

        <!-- Text skeleton -->
        <div class="text-caption text-center q-mt-sm folder-title">
          <q-skeleton type="text" width="100%" height="14px" animation="fade" />
          <q-skeleton type="text" width="100%" height="14px" animation="fade" />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  count: {
    type: Number,
    default: 10 // fallback kalau tidak dikirim
  }
})
</script>

<style scoped>
.folder-card {
  width: 140px;
  transition: all 0.2s ease-in-out;
}

.folder-card:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.folder-title {
  width: 100%;
  padding: 0 8px;
}
</style>
