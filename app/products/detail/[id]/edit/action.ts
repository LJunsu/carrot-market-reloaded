"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { productUpdateSchema } from "./schema";

export async function updateProduct(_: unknown, formData: FormData) {
    const data = {
        id: formData.get("productId"),
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description")
    };

    const result = productUpdateSchema.safeParse(data);
    if(!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if(session.id) {
            const product = await db.product.update({
                where: {
                    id: Number(data.id)
                },
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    photo: result.data.photo || undefined,
                    user: {
                        connect: {
                            id: session.id
                        }
                    }
                },
                select: {
                    id: true
                }
            });
            
            revalidateTag("products");
            redirect(`/products/detail/${product.id}`);
        }
    }
}