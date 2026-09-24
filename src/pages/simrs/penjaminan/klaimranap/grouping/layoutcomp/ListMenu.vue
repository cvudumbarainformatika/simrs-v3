<template>
  <q-list class="q-pa-xs">
    <q-item
      v-for="item in menus"
      :key="item.name"
      v-ripple
      clickable
      :active="menu?.name === item.name"
      active-class="bg-primary text-white shadow-1"
      class="q-my-xs rounded-borders"
      style="min-height: 44px;"
      @click="emits('menuClick', item)"
    >
      <q-item-section avatar style="min-width: 36px;">
        <q-icon :name="item.icon" size="18px" />
      </q-item-section>
      <q-item-section class="text-weight-bold f-12">
        {{ item.label }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const emits = defineEmits(['menuClick'])
defineProps({
  menus: {
    type: Array,
    default: () => []
  },
  menu: {
    type: Object,
    default: null
  }
})
</script>
