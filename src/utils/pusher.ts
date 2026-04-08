import Pusher from 'pusher-js';

// Configuration from developer
const PUSHER_KEY = '25cbe8341f85bef2a680';
const PUSHER_CLUSTER = 'ap2';

export const pusherClient = new Pusher(PUSHER_KEY, {
  cluster: PUSHER_CLUSTER,
  forceTLS: false, // As per developer instructions
});
