import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "@/server/orpc/router";

const handler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

async function handle(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: {},
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handle;
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
