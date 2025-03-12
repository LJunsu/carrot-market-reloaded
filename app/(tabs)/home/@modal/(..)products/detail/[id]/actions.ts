"use server"

import db from "@/lib/db";
import { revalidateTag } from "next/cache";

export const productDelete = async (userId: number, productId: number, productUserId: number) => {
    if(userId !== productUserId) {
        return {error: "권한이 없습니다."}
    }

    await db.product.delete({
        where: {
            id: productId
        }
    });

    revalidateTag("products");
    return {success: true}
}