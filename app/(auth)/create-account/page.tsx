"use client";

import "@/app/globals.css";
import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import { useActionState } from "react";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

const initalState = {
    error: undefined,
    username: "",
    email: "",
    password: "",
    confirm_password: ""
}

export default function CreateAccount() {
    const [state, dispatch] = useActionState(createAccount, null);
    const {error, username, email, password, confirm_password} = state || initalState;

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>

            <form 
                action={dispatch}
                className="flex flex-col gap-3"
            >
                <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    // errors={state?.fieldErrors.username}
                    errors={error?.fieldErrors.username}
                    minLength={3}
                    maxLength={10}
                    defaultValue={(username as string) ?? ""}
                />

                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    // errors={state?.fieldErrors.email}
                    errors={error?.fieldErrors.email}
                    defaultValue={(email as string) ?? ""}
                />

                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    // errors={state?.fieldErrors.password}
                    errors={error?.fieldErrors.password}
                    minLength={PASSWORD_MIN_LENGTH}
                    defaultValue={(password as string) ?? ""}
                />

                <Input
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    // errors={state?.fieldErrors.confirm_password}
                    errors={error?.fieldErrors.confirm_password}
                    minLength={PASSWORD_MIN_LENGTH}
                    defaultValue={(confirm_password as string) ?? ""}
                />

                <Button
                    text="Create account"
                />
            </form>

            <SocialLogin />
        </div>
    );
}