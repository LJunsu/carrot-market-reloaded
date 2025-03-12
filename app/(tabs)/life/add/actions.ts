"use server";

import getSession from "@/lib/session";
import { postSchema } from "./schema";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

export async function uploadPost(_: unknown, formData: FormData) {
    const data = {
        title: formData.get("title"),
        description: formData.get("description")
    };

    const result = postSchema.safeParse(data);
    if(!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if(session.id) {
            const post = await db.post.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    user: {
                        connect: {
                            id: session.id
                        }
                    }
                },
                select: {
                    id: true
                }
            })

            revalidateTag("post");

            redirect(`/posts/${post.id}`);
        }
    }
}