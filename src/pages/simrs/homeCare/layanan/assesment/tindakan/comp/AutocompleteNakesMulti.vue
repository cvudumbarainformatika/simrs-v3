<script setup>
import { ref, toRef } from 'vue'

const props = defineProps({
  model: {
    type: [Array, String],
    default: () => null
  },
  source: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:model', 'update:modelValue'])

const filterOptions = ref([])
const refAutocomplete = ref(null)

defineExpose({
  refAutocomplete,
  reset: () => {
    if (refAutocomplete.value?.reset) refAutocomplete.value.reset()
    if (refAutocomplete.value?.resetValidation) refAutocomplete.value.resetValidation()
  }
})

const createValue = (val, done) => {
  if (val?.length > 0) {
    const current = Array.isArray(props.model) ? [...props.model] : []
    val
      .split(/[,;|]+/)
      .map(v => v.trim())
      .filter(v => v?.length > 0)
      .forEach(v => {
        if (!current.includes(v)) {
          current.push(v)
        }
      })

    done(null)
    emits('update:model', current)
    emits('update:modelValue', current)
  }
}

const filterFn = (val, update) => {
  update(() => {
    if (val === '') {
      filterOptions.value = props.source
    }
    else {
      const needle = val.toLowerCase()
      filterOptions.value = props.source?.filter(
        v => v?.nama?.toLowerCase().indexOf(needle) > -1
      )
    }
  },
  ref => {
    if (val !== '' && ref.options?.length) {
      ref.setOptionIndex(-1)
      ref.moveOptionSelection(1, true)
    }
  })
}

</script>

<template>
  <q-select
    ref="refAutocomplete"
    outlined
    standout="bg-yellow-3"
    label="Pilih Pelaksana"
    use-input
    use-chips
    multiple
    input-debounce="0"
    :options="filterOptions"
    @new-value="createValue"
    @filter="filterFn"
    @update:model-value="(val) => {
      emits('update:model', val)
      emits('update:modelValue', val)
    }"
    hide-bottom-space
  />
</template>
