"use client";

import "@/app/globals.css";
import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import { login } from "./actions";
import { useActionState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function LogIn() {
    const [state, dispatch] = useActionState(login, null);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">이메일과 비밀번호로 로그인하세요.</h2>
            </div>

            <form action={dispatch} className="flex flex-col gap-3">
                <Input
                    name="email"
                    type="email"
                    placeholder="이메일"
                    required
                    errors={state?.fieldErrors.email}
                />

                <Input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.fieldErrors.password}
                />

                <Button
                    text="로그인"
                />
            </form>

            <SocialLogin />
        </div>
    );
}