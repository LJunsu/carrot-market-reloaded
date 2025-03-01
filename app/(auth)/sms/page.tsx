"use client";

import "@/app/globals.css";
import Input from "@/components/input";
import Button from "@/components/button";
import { smsLogIn } from "./actions";
import { useActionState } from "react";

const initialState  = {
    token: false,
    error: undefined,
    phone: ""
}

export default function SMSLogin() {
    const [state, dispatch] = useActionState(smsLogIn, initialState);
    const {token, error, phone} = state ?? initialState;
    console.log(token);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">SMS Login</h1>
                <h2 className="text-xl">Verify your phone number.</h2>
            </div>

            <form action={dispatch} className="flex flex-col gap-3">
                {state.token ?
                    <Input
                        name="token"
                        type="number"
                        placeholder="Verification code"
                        required
                        min={100000}
                        max={999999}
                    /> :
                    <Input
                        name="phone"
                        type="text"
                        placeholder="Phone number"
                        required
                        errors={error?.formErrors}
                        defaultValue={(phone as string) ?? ""}
                    />
                }

                <Button
                    text={state.token ? "Verify Token" : "Send Verification SMS"}
                />
            </form>
        </div>
    );
}