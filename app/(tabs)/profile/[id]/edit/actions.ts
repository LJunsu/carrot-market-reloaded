"use server";

import db from "@/lib/db";
import { profileUpdateSchema } from "./schema";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

export async function isCheckPassword(formData: FormData) {
    const session = await getSession();

    const user = await db.user.findUnique({
        where: {
            id: session.id
        },
        select: {
            id: true,
            password: true
        }
    })
    const inPassword = formData.get("password") as string;
    const ok = await bcrypt.compare(inPassword, user!.password ?? "");
    return ok;
}

export async function updateProfile(_: unknown, formData: FormData) {
    const data = {
        id: Number(formData.get("userId")),
        avatar: formData.get("avatar"),
        username: formData.get("username"),
        phone: formData.get("phone"),
        nextPassword: formData.get("nextPassword"),
        checkPassword: formData.get("checkPassword")
    }
    
    const result = profileUpdateSchema.safeParse(data);
    if(!result.success) {
        return result.error.flatten();
    } else {        
        const duplicateUser = await db.user.findFirst({
            where: {
                id: {
                    not: result.data.id
                },
                username: result.data.username
            }
        })

        if(duplicateUser) {
            return {
                fieldErrors: {
                    username: ["이미 존재하는 이름입니다."],
                }
            }
        } else {
            let hashedPassword;
            if(!data.nextPassword && !data.checkPassword) {
                hashedPassword = undefined;
            } else {
                hashedPassword = await bcrypt.hash(result.data.nextPassword as string, 12);
            }

            await db.user.update({
                where: {
                    id: result.data.id
                },
                data: {
                    avatar: result.data.avatar || undefined,
                    username: result.data.username,
                    phone: result.data.phone,
                    password: hashedPassword,
                }
            })

            redirect("/profile")
        }
    }
}