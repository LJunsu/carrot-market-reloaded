"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const title = z.string();

export async function startStream(_: unknown, formData: FormData) {
    const result = title.safeParse(formData.get("title"));
    if(!result.success) {
        return result.error.flatten();
    }

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.CLOUDFLARE_API_KEY}`
            },
            body: JSON.stringify({
                meta: {
                    name: result.data
                },
                recording: {
                    mode: "automatic"
                }
            })
        }
    );
    const data = await response.json();

    const session = await getSession();
    const stream = await db.liveStream.create({
        data: {
            title: result.data,
            stream_id: data.result.uid,
            stream_key: data.result.rtmps.streamKey,
            userId: session.id!
        },
        select: {
            id: true
        }
    });

    redirect(`/streams/${stream.id}`);
}