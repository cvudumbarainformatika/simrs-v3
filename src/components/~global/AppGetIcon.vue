<template>
  <q-dialog persistent :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down">
    <q-card class="">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn v-close-popup dense flat icon="icon-mat-close">
          <q-tooltip class="bg-white text-primary">
            Close
          </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <div class="flex justify-end q-mb-md">
          <div style="width: 200px;">
            <app-input v-model="search" dense valid label="search" />
          </div>
        </div>
        <div class="row items-center q-col-gutter-md">
          <div v-for="(icon, i) in filteredList()" :key="i" class="col-md-2 col-ld-2 col-xl-2 col-sm-6 col-xs-6">
            <div class="text-center q-my-xs cursor-pointer">
              <!-- {{ icon }} -->
              <q-icon :name="icon" :size="i + 1 === hovered ? `${30}px` : `${25}px`" @mouseover="hovered = i + 1"
                @mouseleave="hovered = 0" @click="copied(icon)" />
              <div style="font-size: 9px;" class="ellipsis q-mt-sm">
                <span :class="{
                  'bg-grey-3':
                    search.toLowerCase().includes(icon)
                }">{{ icon }}</span>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { copyToClipboard } from 'quasar'
import { notifErr } from 'src/modules/utils'
import { ref, onMounted, computed } from 'vue'
const iconLists = import.meta.glob('./../../custom-icons/svg/**/*.svg', { eager: true, import: 'default' })

const maximizedToggle = ref(true)
const hovered = ref(0)
const search = ref('')

const folders = computed(() => {
  const thumb = []
  Object.entries(iconLists).forEach(([path, m]) => {
    // console.log('path', path?.split('/')[4]);

    const folder = path.split('/')[4]
    // console.log('folder', folder);
    const file = path.split('/').pop().replace(/\.\w+$/, '')
    // console.log('file', file);
    const result = 'icon-' + folder + '-' + file
    // console.log('result', result);
    thumb.push(result)
  })



  return thumb
})
onMounted(() => {
  // console.log(folders.value)
})

const emits = defineEmits(['copyText'])

function filteredList() {
  // console.log('folders', folders.value);

  return folders.value.filter((fruit) =>
    fruit.toLowerCase().includes(search.value.toLowerCase())
  )
}

function copied(text) {
  copyToClipboard(text)
    .then(() => {
      emits('copyText', text)
    })
    .catch(() => {
      const resp = {
        status: 500
      }

      notifErr(resp)
    })
}
</script>
