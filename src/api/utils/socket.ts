import {io} from 'socket.io-client';

// export const socket = io('https://react-native-course.oneentry.cloud/', {
//   autoConnect: false,
//   transports: ['websocket'],
//   path: '/hooks/content/ws',
//   reconnection: true, // Enable reconnection
//   reconnectionAttempts: 5, // Number of reconnection attempts
//   reconnectionDelay: 1000, // Delay between reconnection attempts in ms
//   extraHeaders: {
//     'x-app-token':
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po',
//   },
// });
//
// socket.on('disconnect', (reason, description) => {
//   console.log(`Disconnected to the server: ${reason}`);
// });
//
// socket.on('connect', () => {
//   console.log('Connected to the server');
// });
//
// socket.on('notification', async (res: string) => {
//   console.log('=>(hooks.ts:16) res ', res);
// });
