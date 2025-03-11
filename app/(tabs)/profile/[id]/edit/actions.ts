"use server";

import db from "@/lib/db";
import { profileUpdateSchema } from "./schema";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";


export async function updateProfile(_: unknown, formData: FormData) {
    const data = {
        id: Number(formData.get("userId")),
        avatar: formData.get("avatar"),
        username: formData.get("username"),
        phone: formData.get("phone"),
        prevPassword: formData.get("prevPassword"),
        nextPassword: formData.get("nextPassword"),
        checkPassword: formData.get("checkPassword")
    }
    
    const result = profileUpdateSchema.safeParse(data);
    if(!result.success) {
        return result.error.flatten();
    } else {
        const user = await db.user.findUnique({
            where: {
                id: result.data.id
            },
            select: {
                id: true,
                password: true
            }
        })
        
        const ok = await bcrypt.compare(result.data.prevPassword, user!.password ?? "");
        if(ok) {
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
                        username: ["Wrong username."],
                    }
                }
            } else {
                const hashedPassword = await bcrypt.hash(result.data.nextPassword, 12);
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
        } else {
            return {
                fieldErrors: {
                    prevPassword: ["Wrong password."],
                }
            }
        }
    }
}