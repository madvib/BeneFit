// interface CloudflareEnv {
//   // Define your Agent on the environment here
//   // Passing your Agent class as a TypeScript type parameter allows you to call
//   // methods defined on your Agent.
//   USER_HUB: AgentNamespace<UserHub>;

export { default as UserHub } from './user-hub/user-hub.v2';

export default {
  fetch() {
    return new Response('UserHub DO - Access via binding', { status: 404 });
  },
};
