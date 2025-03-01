import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { cache } from "react";

const getUserData = cache(async () => {
    return await getUser();
})

async function getUser(){
    const session = await getSession();
    console.log(session);
    if(session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id
            }
        });
        
        if(user) {
            return user;
        }
    }
    notFound();
}

export default async function ProfileContent() {
    const user = await getUserData();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        session.destroy();
        redirect("/");
    }

    return (
        <div>
            <h1>Welcom! {user?.username}</h1>
            <form action={logOut}>
                <button>Log out</button>
            </form>
        </div>
    )
}