export { UserHub } from './user-hub/user-hub';

export default {
  fetch() {
    return new Response('UserHub DO - Access via binding', { status: 404 });
  },
};
