import Pusher from 'pusher-js';

// Configuration from developer
const PUSHER_KEY = '25cbe8341f85bef2a680';
const PUSHER_CLUSTER = 'ap2';

// Resolve Pusher constructor for both ESM and CJS environments
const PusherConstructor = (Pusher as any).default || Pusher;

export const pusherClient = typeof window !== 'undefined' 
  ? new PusherConstructor(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: false, // As per developer instructions
    })
  : null;
