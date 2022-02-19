import { resp_store } from "./store.ts";

resp_store.set("authcode", new Map());

export type PushAuthcode = {
    email: string;
    code: string;
};

/* 
    {
        "email": string,
        "code": string
    }
*/
export const push_authcode = (command: PushAuthcode) => {
    if (!command.email && !command.code) {
        return;
    }

    const authcode = resp_store.get("authcode") as Map<string, string>;

    authcode.set(command.email, command.code);

    console.log("pushed ", command);

    setTimeout(
        (email) => {
            const authcode = resp_store.get("authcode") as Map<string, string>;

            authcode.delete(email);
        },
        1 * 10 * 1000,
        command.email,
    );
};

export type GetAuthcode = {
    email: string;
    port: number;
};

/*
    Send
    {
        "code": string
    }
*/
export const get_authcode = async (command: GetAuthcode) => {
    if (!command.email && !command.port) {
        return;
    }

    const authcode = resp_store.get("authcode") as Map<string, string>;

    const code = authcode.get(command.email);

    const body = { code };

    console.log("got ", body);

    console.log(Deno.env.get("E2E_TESTING_URL"));

    let r = await fetch(`${Deno.env.get("E2E_TESTING_URL")}:${command.port}`, {
        method: "POST",
        body: JSON.stringify(body),
    });

    console.log("resp ", r.status);

    authcode.delete(command.email);
};
