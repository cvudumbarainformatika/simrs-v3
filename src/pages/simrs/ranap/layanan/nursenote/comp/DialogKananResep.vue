<template>
  <transition name="slide-right" mode="in-out">
    <div v-if="store.dialogPreview" class="slide-panel">
      <div class="header items-center">
        <q-btn flat icon="icon-mat-close" padding="sm" class="back-btn" @click="store.dialogPreview = false" />
        <div class="title">Daftar Obat</div>
        <q-input dark outlined v-model="searchQuery" placeholder="Cari Obat..." dense class="search-bar" debounce="300"
          clearable hide-bottom-space />
      </div>


      <!-- List Obat yang Bisa Di-Scroll -->
      <div v-if="filteredObat.length > 0" class="scrollable-list">
        <q-list bordered class="futuristic-list">
          <q-item v-for="obat in filteredObat" :key="obat.id" clickable @click="selectObat(obat)"
            class="futuristic-item">
            <q-item-section>
              <q-item-label class="text-bold">{{ obat?.nama_obat }}</q-item-label>
              <q-item-label class="text-yellow">kandungan : {{ obat?.kandungan }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-white">{{ obat?.jumlah }} {{ obat?.satuan }} ({{ obat?.sediaan
                }})</q-item-label>
              <q-item-label caption class="text-white">aturan : {{ obat?.aturan }}</q-item-label>
              <!-- <q-item-label caption class="text-white">tgl : {{ obat?.waktu }}</q-item-label> -->
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-else class="q-pa-lg full-height">
        <div class="empty-state flex flex-center column q-pa-lg full-height">
          <!-- <q-icon name="medical_services" size="64px" color="grey-5" /> -->
          <div class="text-grey" style="font-size: 4rem;">⚕️</div>
          <div class="text-subtitle1 text-grey-5 q-mt-md">
            Obat Belum Resep
          </div>
        </div>
      </div>

      <!-- Input Section Muncul Saat Obat Dipilih -->
      <div v-if="selectedObat" class="input-section distinct-input-section">
        <div class="f-20 text-dark text-bold">{{ selectedObat?.nama_obat }}</div>
        <div class="f-14 text-info">{{ selectedObat?.kandungan }}, {{ selectedObat?.satuan }} , aturan : {{
          selectedObat?.aturan }}</div>
        <q-separator class="q-my-lg"></q-separator>
        <div class="flex q-gutter-sm">
          <q-input v-model="selectedObat.jumlah" label="jml Pemakaian" type="number" filled style="width: 23%;" />
          <q-input v-model="selectedObat.sisa" label="Sisa Obat" type="number" filled style="width: 23%;" />
          <q-input v-model="selectedObat.satuan_ambil" label="Satuan" filled style="width: 23%;" />
          <q-input v-model="selectedObat.dosis" label="Dosis" filled style="width: 23%;" />
        </div>
        <div class="flex q-gutter-md">

          <!-- <q-input v-model="selectedObat.sisa" label="Sisa Obat" type="number" filled style="width: 30%;" /> -->
          <!-- <q-input v-model="selectedObat.satuan" label="Satuan" filled style="width: 30%;" /> -->
        </div>
        <q-separator class="q-my-lg"></q-separator>
        <div class="button-group">
          <q-btn label="Kirim" color="positive" @click="submitObat" class="futuristic-button" />
          <q-btn label="Tutup" color="negative" @click="closeForm" class="futuristic-button" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { dateDbFormat, dateFull, dateFullFormat } from 'src/modules/formatter';
import { useNurseNoteRanapStore } from 'src/stores/simrs/ranap/nursenote';
import { ref, computed, onMounted } from 'vue';

const store = useNurseNoteRanapStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  status: {
    type: String,
    default: 'add'
  }
})

const emits = defineEmits(['addToList'])


onMounted(() => {
  setitems()
})




const daftarObat = ref([])

const setitems = () => {
  let arr = []
  const reseps = props?.pasien?.newapotekrajal ?? []

  if (reseps.length) {
    const detailsResep = reseps?.map(x => x?.permintaanresep?.filter?.(y => y?.mobat?.jenis_perbekalan === 'Obat').map(y => {
      return {
        kdobat: y?.kdobat,
        nama_obat: y?.mobat?.nama_obat,
        kandungan: y?.kandungan,
        uraian: y?.uraian108,
        jumlah: y?.jumlah,
        aturan: y?.aturan,
        created_at: y?.created_at,
        waktu: dateFull(y?.created_at),
        uraian: y?.uraian,
        satuan: y?.mobat?.satuan_k,
        sediaan: y?.mobat?.bentuk_sediaan,
        jenis: y?.mobat?.jenis_perbekalan
      }
    }))?.flat()
    const newArr = [...new Set(detailsResep)]
    newArr?.sort((a, b) => {
      const tanggalA = new Date(a?.created_at);
      const tanggalB = new Date(b?.created_at);
      return tanggalA - tanggalB;
    });
    const result = newArr?.reduce((acc, current) => {
      const existing = acc.find(item => item.kdobat === current.kdobat);
      if (existing) {
        existing.nama_obat = current.nama_obat;
        existing.kandungan = current.kandungan;
        existing.uraian = current.uraian;
        existing.jumlah = current.jumlah;
        existing.aturan = current.aturan;
        existing.created_at = current.created_at;
        existing.waktu = current.waktu;
        existing.uraian108 = current.uraian108;
        existing.satuan = current.satuan;
        existing.sediaan = current.sediaan;
        existing.jenis = current.jenis;
      } else {
        acc.push(current);
      }
      return acc;
    }, []);
    arr = result
  }

  // return arr
  console.log('arr', arr);

  daftarObat.value = arr
}

const searchQuery = ref('');
const selectedObat = ref(null);



const filteredObat = computed(() => {
  const query = searchQuery?.value?.toLowerCase() || null;
  if (query !== '' && query !== null) {
    return daftarObat.value.filter(obat =>
      obat?.nama_obat?.toLowerCase()?.includes(query) || obat?.kandungan?.toLowerCase()?.includes(query)
    );
  }
  else {
    return daftarObat.value
  }
});

const selectObat = (obat) => {
  selectedObat.value = { ...obat, satuan_ambil: obat?.satuan, dosis: null, flag: '1' }; // flag: 1 = obat resep
};

const submitObat = () => {
  // const index = daftarObat.value.findIndex(o => o.id === selectedObat.value.id);
  // if (index !== -1) {
  //   daftarObat.value[index] = { ...selectedObat.value };
  // }
  // console.log('selectedObat.value', selectedObat.value);

  if (props.status === 'add') {
    store.form.reseps.push(selectedObat.value)
  } else {
    emits('addToList', selectedObat.value)
  }

  selectedObat.value = null;
  // console.log('store.form', store.form.reseps);

};

const closeForm = () => {
  selectedObat.value = null;
};

</script>

<style lang="scss" scoped>
.slide-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 60%;
  /* 3/4 dari komponen utama */
  height: 100%;
  background: #1e293b;
  color: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.4);
  padding: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(0);
}

.close-btn {
  align-self: flex-end;
  color: white;
}

.content {
  margin-top: 20px;
}

/* Animasi Slide Masuk Lebih Lambat */
.slide-right-enter-active {
  transition: transform 0.8s ease, opacity 0.8s ease;
  /* Lebih lambat saat masuk */
}

.slide-right-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
  /* Tetap cepat saat keluar */
}

.slide-right-enter {
  transform: translateX(100%);
  /* Masuk dari kanan */
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  /* Keluar ke kanan */
  opacity: 0;
}





/* Header Tetap */
.header {
  position: sticky;
  top: 0;
  background: #1e293b;
  padding: 20px;
  z-index: 10;
  display: flex;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
}

.title {
  flex-grow: 1;
  font-size: 20px;
  font-weight: bold;
}

.search-bar {
  width: 200px;
}

.back-btn {
  color: white;
}

/* List Scrollable */
.scrollable-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.futuristic-list {
  background: #334155;
  border-radius: 12px;
  padding: 10px;
}

.futuristic-item {
  background: #475569;
  margin-bottom: 10px;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.futuristic-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
}

/* Input Section */
.input-section {
  background: #334155;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  margin: 20px;
}

.q-input {
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.futuristic-button {
  padding: 10px 20px;
  border-radius: 12px;
  background: linear-gradient(145deg, #1e293b, #334155);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.futuristic-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
}

.input-section.distinct-input-section {
  background: #fff;
  /* Warna lebih terang untuk form input */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
  margin: 20px;
}

.empty-state {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(8px);
}
</style>
