import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { logger } from "https://deno.land/x/abc@v1.3.3/middleware/logger.ts";

import type { Kind } from "./kind.ts";
import { get_authcode, push_authcode } from "./authcode.ts";

const app = new Application();

type Command = { kind: Kind };

/* 
    <-
    {
        "kind": "get_authcode",
        "port": 12345
    }

    -> http://madome-runner:12345
    {
        "code": "ahkjdahf"
    }

    <- http://madome-runner:12345

    ->
*/
app.use(logger())
    .post("/", async (ctx) => {
        const cmd = JSON.parse((await ctx.body) as string) as Command;

        console.log(cmd);

        switch (cmd.kind) {
            case "authcode": {
                await get_authcode(cmd as any);
            }
        }

        ctx.response.status = 204;
        ctx.response.body = "";
    })
    .put("/", async (ctx) => {
        const cmd = JSON.parse((await ctx.body) as string) as Command;

        switch (cmd.kind) {
            case "authcode": {
                push_authcode(cmd as any);
            }
        }

        ctx.response.status = 204;
        ctx.response.body = "";
    })
    .start({ port: 3112 });
