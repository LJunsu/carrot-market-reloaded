"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export async function likePost(postId: number) {    
    try {
        const session = await getSession();
        await db.like.create({
            data: {
                postId: postId,
                userId: session.id!
            }
        })
        revalidateTag(`like-status-${postId}`);
    } catch {}
}

export async function dislikePost(postId: number) {    
    try {
        const session = await getSession();
        await db.like.delete({
            where: {
                id: {
                    postId: postId,
                    userId: session.id!
                }
            }
        })
        revalidateTag(`like-status-${postId}`);
    } catch {}
}

const formCommentSchema = z.object({
    userId: z.string(),
    postId: z.string(),
    payload: z.string().min(3).max(500)
})

export async function commentPost(formData: FormData) {
    console.log("commentPost -> formData: ", formData);
    const data = {
        userId: formData.get("userId"),
        postId: formData.get("postId"),
        payload: formData.get("comment"),
    }
    console.log("commentPost -> data: ", data);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    const result = await formCommentSchema.safeParseAsync(data);
    if(!result.success) {
        result.error.flatten();
    } else {
        await db.comment.create({
            data: {
                userId: Number(result.data.userId),
                postId: Number(result.data.postId),
                payload: result.data.payload
            }
        })

        revalidateTag("post-detail");
    }
}