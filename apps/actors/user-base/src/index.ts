// interface CloudflareEnv {
//   // Define your Agent on the environment here
//   // Passing your Agent class as a TypeScript type parameter allows you to call
//   // methods defined on your Agent.
//   USER_BASE: AgentNamespace<UserBase>;

export { UserBase } from './user-base/user-base';


export default {
  fetch() {
    return new Response('User_Base DO - Access via binding', { status: 404 });
  },
};
