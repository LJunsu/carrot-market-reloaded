"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import {z} from "zod";
import bcrypt from "bcrypt"
import Login from "@/lib/login";

const checkUsername = (username: string) => !username.includes("potato");

const checkPasswords = 
    ({password, confirm_password}: {password: string, confirm_password: string}) => 
        password === confirm_password

const formSchema = z.object({
    username: z.string({
        invalid_type_error: "이름은 반드시 문자여야 합니다.",
        required_error: "이름을 입력하세요."
    }).toLowerCase().trim()//.transform(username => `${username}🔥`)
        .refine(username => checkUsername(username), "이 이름은 이미 사용 중 입니다."),

    email: z.string().email().toLowerCase(),

    password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),

    confirm_password: z.string().min(PASSWORD_MIN_LENGTH)
}).superRefine(async ({username}, ctx) => {
    const user = await db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        }
    });
    if(user) {
        ctx.addIssue({
            code: "custom",
            message: "이 이름은 이미 사용 중 입니다.",
            path: ["username"],
            fatal: true
        });
        return z.NEVER;
    }
}).superRefine(async ({email}, ctx) => {
    const user = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true
        }
    });
    if(user) {
        ctx.addIssue({
            code: "custom",
            message: "이 이메일은 이미 사용 중 입니다.",
            path: ["email"],
            fatal: true
        });
        return z.NEVER;
    }
}).refine(checkPasswords, {
    message: "두 비밀번호가 일치하지 않습니다.",
    path: ["confirm_password"]
});

export async function createAccount(prevState: unknown, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password")
    }

    const result = await formSchema.safeParseAsync(data);
    if(!result.success) {
        return {
            error: result.error.flatten(), 
            username: data.username, 
            email: data.email, 
            password: data.password, 
            confirm_password: data.confirm_password
        }
    } else {
        const hashedPassword = await bcrypt.hash(result.data.password, 12);
        
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword
            },
            select: {
                id: true
            }
        });

        return Login(user.id);
    }
}