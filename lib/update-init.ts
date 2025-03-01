"use server";
import db from "./db";

export default async function updateInit(id: number) {

    const product = await db.product.findUnique({
        where: {
            id
        }, include: {
            user: {
                select: {
                    username: true,
                    avatar: true
                }
            }
        }
    });

    return product;
}