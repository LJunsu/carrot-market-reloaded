"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function likePost(postId: number) {
    await new Promise((r) => setTimeout(r, 10000));
    
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
    await new Promise((r) => setTimeout(r, 10000));
    
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