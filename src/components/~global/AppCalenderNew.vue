<template>
  <!-- <q-dialog> style="width: 25vw; max-width: 90vw; height:auto;"-->
  <q-card>
    <q-card-section class="halaman">
      <div class="awak">
        <div class="container">
          <div class="calender">
            <div
              class="month text-white"
              :class="'bg-'+props.bgColor"
            >
              <q-btn
                round
                flat
                icon="icon-mat-chevron_left"
                color="white"
                size="1rem"
                :loading="props.loading"
                @click="prev"
              />
              <div class="date">
                <h1 class="cursor-pointer">
                  {{ monthName }}
                  <!-- <q-menu
                    transition-show="flip-right"
                    transition-hide="flip-left"
                  >
                    bulan
                  </q-menu> -->
                </h1>
                <p class="cursor-pointer">
                  {{ fullYear }}
                </p>
                <q-menu
                  transition-show="flip-right"
                  transition-hide="flip-left"
                >
                  <q-card>
                    <q-card-section>
                      <div class="fit row no-wrap justify-evenly items-center content-center">
                        <div>
                          <app-autocomplete
                            v-model="monthSelected"
                            autocomplete="nama"
                            option-label="nama"
                            option-value="value"
                            :source="months"
                            label="Pilih bulan"
                          />
                        </div>
                        <div>
                          <app-autocomplete
                            v-model="yearSelected"
                            :source="years"
                            label="Pilih tahun"
                          />
                        </div>
                      </div>
                    </q-card-section>
                    <q-card-actions align="right">
                      <app-btn
                        v-close-popup
                        label="cancel"
                        class="q-mr-sm"
                        color="dark"
                      />
                      <app-btn
                        v-close-popup
                        label="submit"
                        class="q-mr-sm"
                        color="primary"
                        :loading="props.loading"
                        @click="submit"
                      />
                    </q-card-actions>
                  </q-card>
                </q-menu>
              </div>
              <q-btn
                round
                flat
                icon="icon-mat-chevron_right"
                color="white"
                size="1rem"
                :loading="props.loading"
                @click="next"
              />
            </div>
            <div class="weekdays">
              <div>Min</div>
              <div>Sen</div>
              <div>Sel</div>
              <div>Rab</div>
              <div>Kam</div>
              <div>Jum</div>
              <div>Sab</div>
            </div>
            <div class="days">
              <div
                v-for="(day,i) in days"
                :key="i"
                :class="day?day.class:''"
                :style="day?day.style:''"
                @click="setClick(day,i)"
              >
                {{ day?day.num:1 }}
                <q-menu
                  v-if="day.data || day.libur || day.prota"
                  transition-show="flip-right"
                  transition-hide="flip-left"
                >
                  <div v-if="day.data">
                    <div class="row">
                      <q-chip
                        :style="`color: ${day.data.kategory.warna};`"
                        class="chip-able"
                        dense
                        square
                        outline
                      >
                        <div class="f-12">
                          {{ day.data.kategory.nama }}
                        </div>
                      </q-chip>
                    </div>
                    <div class="row">
                      <q-chip
                        :style="`color: ${day.data.kategory.warna};`"
                        class="chip-able"
                        dense
                        square
                        outline
                      >
                        <div class="f-12">
                          masuk : {{ day.data.masuk }}
                        </div>
                      </q-chip>
                    </div>
                    <div
                      v-if="day.data.terlambat==='yes'"
                      class="row"
                    >
                      <q-chip
                        :style="`color: ${day.data.kategory.warna};`"
                        class="chip-able"
                        dense
                        square
                        outline
                      >
                        <div class="f-12">
                          terlambat : {{ day.data.diff }}
                        </div>
                      </q-chip>
                    </div>
                  </div>
                  <div v-if="day.libur">
                    <div class="row">
                      <q-chip
                        color="primary"
                        text-color="white"
                        class="chip-able"
                        dense
                        square
                      >
                        <div class="f-12">
                          {{ day.libur.flag }}
                        </div>
                      </q-chip>
                    </div>
                  </div>
                  <div v-if="day.prota">
                    <div class="row">
                      <q-chip
                        color="red-14"
                        text-color="white"
                        class="chip-able"
                        dense
                        square
                        outline
                      >
                        <div class="f-12">
                          {{ day.prota.nama }}
                        </div>
                      </q-chip>
                    </div>
                  </div>
                </q-menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <!-- </q-dialog> -->
</template>
<script setup>
import { date } from 'quasar'
import { ref, watch } from 'vue'

const props = defineProps({
  color: { type: String, default: 'primary' },
  bgColor: { type: String, default: 'primary' },
  data: { type: Object, default: () => {} },
  loading: { type: Boolean, default: false }
})
const emits = defineEmits(['onPrev', 'onNext', 'onSubmit'])

const tgl = new Date()
// console.log('tgl now', tgl.getDay())
// pilih range bulan dan tahun
const months = ref([
  { nama: 'Januari', value: '01' },
  { nama: 'Februari', value: '02' },
  { nama: 'Maret', value: '03' },
  { nama: 'April', value: '04' },
  { nama: 'Mei', value: '05' },
  { nama: 'Juni', value: '06' },
  { nama: 'Juli', value: '07' },
  { nama: 'Agustus', value: '08' },
  { nama: 'September', value: '09' },
  { nama: 'Oktober', value: '10' },
  { nama: 'November', value: '11' },
  { nama: 'Desember', value: '12' }

])
const curY = date.formatDate(tgl, 'YYYY')
const years = ref([])
for (let index = 0; index < 11; index++) {
  years.value[index] = curY - 5 + index
}

const monthSelected = ref(null)
const yearSelected = ref(null)

const submit = () => {
  emits('onSubmit', { bulan: monthSelected.value, tahun: yearSelected.value })
  const mth = parseInt(monthSelected.value) - 1
  tgl.setFullYear(yearSelected.value, mth, 1)

  setThisMonts()
  monthSelected.value = null
  yearSelected.value = null
  // console.log('cury', parseInt(curY))
  // console.log('bulan', monthSelected.value)
  // console.log('tahun', yearSelected.value)
}
/// /////////////////////////////////////////
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

const days = ref([])
// const thisMonthName = ref(months[tgl.getMonth()])
const monthName = ref(date.formatDate(tgl, 'MMMM'))
const fullYear = ref(date.formatDate(tgl, 'YYYY'))
const setThisMonts = () => {
  // console.log(props.data)
  days.value = []
  // thisMonthName.value = months[tgl.getMonth()]
  monthName.value = date.formatDate(tgl, 'MMMM')
  fullYear.value = date.formatDate(tgl, 'YYYY')
  const thisYear = tgl.getFullYear()
  const thisMonth = tgl.getMonth()
  // set ke tanggal 1
  tgl.setDate(1)
  const startDayIndex = tgl.getDay() // cara pertama index hari pertama
  // const startDayIndex = new Date(`${thisYear}-${thisMonth + 1}-1`).getDay() // care kedua index hari pertama => rusak
  const lastDayIndex = new Date(thisYear, thisMonth + 1, 0).getDay()
  const nextDay = 7 - lastDayIndex - 1
  // console.log('start day', startDayIndex)
  // console.log('last day', lastDayIndex)
  // console.log('next day', nextDay)
  const totalDate = getDaysInMonth(thisYear, thisMonth)
  const prevTotalDate = getDaysInMonth(thisYear, thisMonth + 1)
  // console.log('total date', totalDate)
  // console.logonP'prev tonNtal date', prevTotalDate)

  // days this month loop
  for (let index = 0; index < totalDate; index++) {
    const har = (index + 1) < 10 ? '0' + (index + 1) : (index + 1)
    const bul = tgl.getMonth() < 10 ? '0' + (tgl.getMonth() + 1) : tgl.getMonth() + 1
    const tah = tgl.getFullYear()
    const temp = (tah + '-' + bul + '-' + har).toString()
    // console.log(date.formatDate(temp, 'dddd'))
    if ((index + 1) === new Date().getDate() && tgl.getMonth() === new Date().getMonth() && date.formatDate(temp, 'dddd') === 'Minggu') {
      days.value[index + startDayIndex] = { num: index + 1, class: 'today text-red', style: '' }
    } else if ((index + 1) === new Date().getDate() && tgl.getMonth() === new Date().getMonth()) {
      days.value[index + startDayIndex] = { num: index + 1, class: 'today ', style: '' }
    } else if (date.formatDate(temp, 'dddd') === 'Minggu') {
      days.value[index + startDayIndex] = { num: index + 1, class: ' text-red ', style: '' }
    } else {
      days.value[index + startDayIndex] = { num: index + 1, class: '', style: '' }
    }
  }
  // previous days loop
  if (startDayIndex > 0) {
    for (let index = startDayIndex; index > 0; index--) {
      days.value[startDayIndex - index] = { num: prevTotalDate - index + 1, class: 'prev-date', style: '' }
    }
  }
  // next days after this month loop
  // if (startDayIndex > 0) {
  for (let index = 1; index <= nextDay; index++) {
    days.value[index + totalDate + startDayIndex - 1] = { num: index, class: 'next-date', style: '' }
  }
  // } else {
  //   for (let index = 0; index < nextDay; index++) {
  //     days.value[index + totalDate] = { num: index + 1, class: 'next-date' }
  //   }
  // }
  // console.log('days', days.value)
}
// first initialization
setThisMonts()

// prev month
const prev = () => {
  const temp = tgl.getMonth() - 1
  // console.log('temp', temp)
  tgl.setMonth(temp)
  emits('onPrev', { bulan: tgl.getMonth() + 1, tahun: tgl.getFullYear() })
  setThisMonts()
  // console.log('tgl prev', tgl)
}

// next month
const next = () => {
  const temp = tgl.getMonth() + 1
  // console.log('temp', temp)
  tgl.setMonth(temp)
  emits('onNext', { bulan: tgl.getMonth() + 1, tahun: tgl.getFullYear() })
  setThisMonts()
  // console.log('tgl next', tgl)
}

// @click days
const setClick = (day, i) => {
  // console.log(day, i)
  const existingClass = day.class.split(' ')
  // console.log('existing', existingClass)
  if (existingClass?.length > 0 && existingClass[0] !== '') {
    const a = existingClass.filter(cla => {
      return cla === 'prev-date'
    })
    const b = existingClass.filter(cla => {
      return cla === 'next-date'
    })
    if (a?.length > 0)prev()
    if (b?.length > 0)next()
  }
}
watch(() => props.data, (data) => {
  const temp = days.value.map((day, i) => {
    const har = day.num < 10 ? '0' + day.num : day.num
    const bul = tgl.getMonth() < 10 ? '0' + (tgl.getMonth() + 1) : tgl.getMonth() + 1
    const tah = tgl.getFullYear()
    return (tah + '-' + bul + '-' + har).toString()
  })
  if (data.tanggals) {
    data.data.forEach(apem => {
      // console.log('tanggal', apem.tanggal)
      const index = temp.indexOf(apem.tanggal)
      const hari = date.formatDate(apem.tanggal, 'dddd') === 'Minggu'
      if (apem.terlambat === 'no') {
        days.value[index].style = `background-color: ${apem.kategory.warna};`
        days.value[index].class = hari ? 'text-red cursor-pointer' : 'text-white cursor-pointer'
      } else {
        days.value[index].class = hari ? 'text-red cursor-pointer bg-orange' : 'bg-orange cursor-pointer'
        days.value[index].style = `color: ${apem.kategory.warna};`
      }
      days.value[index].data = apem
      // console.log('watch', index)
    })
  }
  if (data.libur) {
    if (data.libur?.length) {
      data.libur.forEach(libur => {
        // console.log('tanggal', libur.tanggal)
        const index = temp.indexOf(libur.tanggal)
        const hari = date.formatDate(libur.tanggal, 'dddd') === 'Minggu'
        days.value[index].class = hari ? 'text-red cursor-pointer bg-primary' : 'text-white cursor-pointer bg-primary'
        days.value[index].libur = libur
      })
    }
  }
  if (data.prota) {
    if (data.prota?.length) {
      data.prota.forEach(prota => {
        // console.log('tanggal', prota.tgl_libur)p0
        const index = temp.indexOf(prota.tgl_libur)
        days.value[index].class = 'text-red cursor-pointer '
        days.value[index].prota = prota
      })
    }
  }
})
</script>
<style lang="scss" scoped>
.halaman{
  width: 24vw;
  height: 29vw;
  margin:0;
  padding:0;
  box-sizing: border-box;
}
.awak{
  font-size: 62.5%;
}
.container{
  width: 100%;
  height: 100%;
  // background-color: #fff;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
.calender{
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
width: 16rem;//45
height: 22rem;//52
// box-shadow: 0 0.5rem 2rem rgba(0,0,0,0.4);
}
.month{
  width: 100%;
  height:6rem;
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;
  text-align: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0,0,0,0.5);
}
.month h1{
  font-size: 1.2rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-bottom: 1rem;
}
.month p{
  font-size: 0.8rem;
}
.weekdays{
  width: 100%;
  height: 2rem;
  padding: 0 0.2rem;
  display: flex;
  align-items: center;
}
.weekdays div{
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.1rem;
  width: calc(15.4rem/7);
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0,0,0,0.5);
  opacity: 0.7;
}
.days{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0.2rem;
}
.days div{
  font-size: 0.8rem;
  margin: 0.1rem;
  width: calc(14rem/7);
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0,0,0,0.5);
  transition: background-color 0.2s;
  border-radius: 50%;
}
.days div:hover:not(.prev-date,.next-date){
  background-color: $grey-4;
  // cursor: pointer;
}
.prev-date,
.next-date{
  opacity: 0.5;
}
.prev-date:hover,.next-date:hover{
  background-color: $grey-5;
  cursor: pointer;
}
.today{
  border: 0.1rem solid $grey-5;
  cursor: pointer;
  // background-color: #167e56;
}
</style>
