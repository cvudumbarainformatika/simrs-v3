<template>
  <div class="row fit relative-position">
    <!-- Form Validitas -->
    <div v-if="!isValid" class="fit flex flex-center">
      <q-card class="validation-card" flat bordered>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">SKRINING</div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit="validateForm" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <!-- Checklist Items -->
              <div v-for="(item, index) in validationItems" :key="index" class="col-12">
                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-checkbox v-model="item.checked" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                    <q-item-label caption>{{ item.description }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon :name="item.icon" :color="item.checked ? 'positive' : 'grey'" />
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <div class="row justify-center q-mt-lg">
              <q-btn label="Validasi Data" type="submit" color="primary" :loading="validating"
                :percentage="validationProgress" class="q-px-xl" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <!-- Main Forms Section After Validation -->
    <div v-else class="fit column q-pa-xs">
      <!-- <q-card flat class="fit"> -->
      <!-- Main Form Tabs -->
      <q-tabs v-model="mainTab" dense no-caps inline-label narrow-indicator indicator-color="transparent" align="left"
        class="bg-transparent text-grey-8 mytabs col-auto" active-color="white" active-bg-color="dark"
        :mobile-arrows="false" :outside-arrows="false">
        <!-- <q-tab name="formA" label="Form A" />
          <q-tab name="formB" label="Form B" /> -->

        <q-tab v-for="tb in tabs" :key="tb.name" :ripple="true" :name="tb?.name" content-class="tab-classes">
          <template #default>
            <div class="row q-gutter-x-xs items-center q-px-sm no-wrap" style="border-radius: 10px;">
              <q-icon :name="tb?.icon" size="18px" />
              <div><strong>{{ tb?.label }}</strong></div>
            </div>
          </template>
        </q-tab>
      </q-tabs>

      <!-- Main Form Tab Panels -->
      <q-tab-panels v-model="mainTab" animated class="col full-height bg-transparent q-pa-none relative-position fit">
        <!-- Form A Panel -->
        <q-tab-panel :name="menu?.name" class="q-pa-none">
          <!-- <PemeriksaanUmumPage :pasien="props?.pasien" /> -->
          <component :is="menu?.comp" :pasien="pasien" :kasus="kasus" :nakes="nakes" />
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'

const props = defineProps({
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

// Validation state
const isValid = ref(false)
const validating = ref(false)
const validationProgress = ref(0)

// Tab states
const mainTab = ref('formA')

const tabs = [
  {
    label: 'Formulir A',
    name: 'formA',
    icon: 'icon-mat-description',
    comp: defineAsyncComponent(() => import('./comp/FormPageA.vue'))
  },
  {
    label: 'Formulir B',
    name: 'formB',
    icon: 'icon-mat-description',
    comp: defineAsyncComponent(() => import('./comp/FormPageB.vue'))
  },

]

onMounted(() => {
  mainTab.value = tabs[0].name
})

const menu = computed(() => {
  const by = mainTab.value

  return tabs.find(i => i.name === by)
})

// Validation checklist items
const validationItems = ref([
  {
    label: 'Data Pasien Lengkap',
    description: 'Verifikasi kelengkapan data pribadi pasien',
    icon: 'icon-mat-person',
    checked: false
  },
  {
    label: 'Riwayat Medis',
    description: 'Pemeriksaan riwayat medis pasien',
    icon: 'icon-mat-medical_information',
    checked: false
  },
  {
    label: 'Status Administrasi',
    description: 'Verifikasi status administrasi pasien',
    icon: 'icon-mat-admin_panel_settings',
    checked: false
  },
  {
    label: 'Persetujuan Tindakan',
    description: 'Konfirmasi persetujuan tindakan medis',
    icon: 'icon-mat-fact_check',
    checked: false
  }
])

// Methods
const validateForm = async () => {
  validating.value = true
  validationProgress.value = 0

  // Simulate validation process
  for (let i = 0; i <= 100; i += 20) {
    await new Promise(resolve => setTimeout(resolve, 200))
    validationProgress.value = i
  }

  validating.value = false
  isValid.value = true
}
</script>

<style lang="scss" scoped>
.validation-card {
  max-width: 600px;
  width: 100%;
}

.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

// .q-tab-panels {
//   // background: white;
// }

// :deep(.q-tab-panel) {
//   padding: 0;
// }

// :deep(.q-tab) {
//   min-height: 40px;
//   border-top-left-radius: 10px;
//   border-bottom-right-radius: 10px;
// }</style>
