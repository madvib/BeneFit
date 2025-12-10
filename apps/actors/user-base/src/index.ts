export default {
  /**
   * This is the standard fetch handler for a Cloudflare Worker
   *
   * @param request - The request submitted to the Worker from the client
   * @param env - The interface to reference bindings declared in wrangler.jsonc
   * @param ctx - The execution context of the Worker
   * @returns The response to be sent back to the client
   */
  async fetch(request, env, ctx): Promise<Response> {
    // Create a stub to open a communication channel with the Durable Object
    // instance named "foo".
    //
    // Requests from all Workers to the Durable Object instance named "foo"
    // will go to a single remote Durable Object instance.
    const stub = env.MY_DURABLE_OBJECT.getByName('foo');

    // Call the `sayHello()` RPC method on the stub to invoke the method on
    // the remote Durable Object instance.
    const greeting = await stub.sayHello('world');

    return new Response(greeting);
  },
} satisfies ExportedHandler<Env>;
