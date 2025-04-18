import { boot } from 'quasar/wrappers'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

const host = '192.168.101.79'
// const host = '192.168.101.242'

window.Pusher = Pusher

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'simrs_key_harry141312',
  cluster: 'mt1',
  wsHost: host,
  encrypted: false,
  wssPort: 6001,
  wsPort: 6001,
  disableStats: true,
  forceTLS: false, // default true
  enabledTransports: ['ws', 'wss']
})

const channel = window.Echo.channel('public.playground.1')
channel.subscribed(() => {
  // console.log('subscribed!!!')
}).listen('.playground', (e) => {
  return e
})

export default boot(({ store, app }) => {
  console.log('sockets', channel)
})

export { channel }
