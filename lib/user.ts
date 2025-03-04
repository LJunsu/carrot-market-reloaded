"use server";
import db from "./db";

export default async function userInfoSelect(id: number) {

    const user = await db.user.findUnique({
        where: {
            id
        }
    });

    return user;
}