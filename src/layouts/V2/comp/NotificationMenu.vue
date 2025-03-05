<template>
  <q-menu v-if="punyaAkses" fit transition-show="scale" transition-hide="scale">
    <q-list style="min-width: 500px">
      <q-item-label header class="text-primary">
        Notifikasi Laborat
      </q-item-label>

      <q-separator />
      <!-- Notifikasi List -->
      <q-scroll-area style="height: 300px; max-height: 300px">
        <template v-for="(notification, index) in notifications" :key="index">
          <q-item clickable v-ripple class="notification-item" @click="markAsRead(index)">
            <q-item-section avatar>
              <q-avatar rounded size="40px" :color="notification.color">
                <q-icon :name="notification.icon" color="white" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ notification.title }}
              </q-item-label>
              <q-item-label caption>{{ notification.time }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge v-if="!notification.read" color="red" rounded>New</q-badge>
            </q-item-section>
          </q-item>
          <!-- Separator antar notifikasi -->
          <q-separator v-if="index < notifications.length - 1" />
        </template>
      </q-scroll-area>

      <!-- Footer -->
      <q-separator />
      <q-item clickable v-close-popup>
        <q-item-section class="text-center text-primary" @click="viewAll">
          10 Permintaan Baru
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import { useTransaksiLaboratTable } from "src/stores/simrs/penunjang/laborat/transaksi_laborat";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { laravelEcho } from 'src/modules/newsockets'
import { useAplikasiStore } from "src/stores/app/aplikasi";


const router = useRouter()
const route = useRoute()
const lab = useTransaksiLaboratTable()
const auth = useAplikasiStore()

const punyaAkses = ref(false)

const notifications = ref([
  { title: "New Order Received", time: "5 min ago", icon: "icon-mat-medical_information", color: "blue", read: false, to: "/admin/laborat/table" },
  { title: "Payment Successful", time: "10 min ago", icon: "icon-mat-medical_information", color: "green", read: false },
  { title: "New User Registered", time: "15 min ago", icon: "icon-mat-medical_information", color: "orange", read: true },
  { title: "System Update Available", time: "1 hour ago", icon: "icon-mat-medical_information", color: "purple", read: false },
  { title: "System Update Available", time: "1 hour ago", icon: "icon-mat-medical_information", color: "purple", read: false },
  { title: "System Update Available", time: "1 hour ago", icon: "icon-mat-medical_information", color: "purple", read: false },
  { title: "System Update Available", time: "1 hour ago", icon: "icon-mat-medical_information", color: "purple", read: false },
  { title: "System Update Available", time: "1 hour ago", icon: "icon-mat-medical_information", color: "purple", read: false },
  { title: "System Update Available", time: "1 hour ago", icon: "icon-mat-medical_information", color: "purple", read: false },
]);

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);

const markAsRead = (index) => {

  const path = route?.fullPath
  console.log('index', index, path);

  if (path === notifications.value[index].to) {
    lab.fromNotifs()
  } else {

    router.push(notifications.value[index].to)
    lab.cobaNotifikasi()
  }

  notifications.value[index].read = true;
};

const viewAll = () => {
  notifications.value.forEach((n) => (n.read = true));
};


onMounted(() => {

  Promise.all([
    lihatAksesLaborat(),
    subscribedChannel()
  ])


})

const lihatAksesLaborat = () => {
  const apps = auth?.items
  console.log('user', apps);
  const haveAkses = apps?.find(x => x?.aplikasi === 'laborat') ? true : false
  punyaAkses.value = haveAkses
}


const subscribedChannel = () => {
  const channel = laravelEcho.private('private.notif.permintaan-laborat')
  channel.subscribed(() => {
    console.log('subscribed private.notif.permintaan-laborat channel !!!')
  }).listen('.notif-message', (e) => {
    // console.log('listen notif', e)
    const message = e?.message?.data || null
    console.log('message', message);

  })
}
</script>

<style lang="scss" scoped>
// .notification-item:hover {
//   background-color: #f5f5f5;
// }</style>