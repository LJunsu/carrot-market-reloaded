"use server"

import db from "@/lib/db";
import { z } from "zod"
import bcrypt from "bcrypt";
import Login from "@/lib/login";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";

const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            // email: email
            email
        }, 
        select: {
            id: true
        }
    });

    return Boolean(user);
}

const formSchema = z.object({
    email: z.string({
        required_error: "이메일을 입력하세요."
    }).email().toLowerCase()
    .refine(checkEmailExists, "이 이메일이 포함된 계정이 존재하지 않습니다."),
    password: z.string()
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
})

export const login = async (prevState: unknown, formData: FormData) => {
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    }

    const result = await formSchema.safeParseAsync(data);
    if(!result.success) {
        return result.error.flatten();
    } else {
        const user = await db.user.findUnique({
            where: {
                email: result.data.email
            },
            select: {
                id: true,
                password: true
            }
        })

        const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
        if(ok) {
            return Login(user!.id);
        } else {
            return {
                fieldErrors: {
                    password: ["잘못된 비밀번호입니다."],
                    email: []
                }
            }
        }
    }
}