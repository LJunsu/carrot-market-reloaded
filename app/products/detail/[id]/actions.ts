"use server"

import db from "@/lib/db"
import getSession from "@/lib/session"
import { redirect } from "next/navigation";

export const createChatRoom = async (formData: FormData) => {
    const session = await getSession();

    const room = await db.chatRoom.create({
        data: {
            users: {
                connect: [
                    {
                        id: Number(formData.get("productUserId"))
                    }, {
                        id: session.id
                    }
                ]
            }
        },
        select: {
            id: true
        }
    })

    redirect(`/chats/${room.id}`);
}