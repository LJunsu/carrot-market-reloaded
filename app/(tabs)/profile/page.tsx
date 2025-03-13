import UserProductList from "@/components/user-product-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { PencilSquareIcon, UserIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function getUser() {
    const session = await getSession();

    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        if (user) {
            return user;
        }
    }

    notFound();
}
  
async function Username() {
    const user = await getUser();
    return (
        <div className="*:text-white">
            {user.github_id
            ? <div className="flex gap-3">
                {user.avatar
                ? <Image
                src={user?.avatar} alt={user?.username}
                width={40} height={40}
                className="rounded-full"
                />
                : <UserIcon className="size-10 rounded-full" />}

                <h1 className="flex items-center">반갑습니다! {user?.username}님!</h1>
            </div>
            : <Link href={`/profile/${user.id}/edit`} className="flex gap-3">
                {user.avatar
                ? <Image
                src={user?.avatar} alt={user?.username}
                width={40} height={40}
                className="rounded-full"
                />
                : <UserIcon className="size-10 rounded-full" />}

                <h1 className="flex items-center">반갑습니다! {user?.username}님!</h1>

                <PencilSquareIcon className="size-4" />
            </Link>
            }

        </div>
    )
}

async function getUserProducts(userId: number) {
    const products = await db.product.findMany({
        where: {
            userId: userId
        },
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 1,
        orderBy: {
            created_at: "desc"
        }
    });

    return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getUserProducts>;
  
export default async function Profile() {
    const logOut = async () => {
        "use server";
        const session = await getSession();
        session.destroy();
        redirect("/");
    };

    const user = await getUser();

    const initialProducts = await getUserProducts(user.id);

    return (
        <div className="p-5 pb-20 flex flex-col gap-5">
            <div className="w-full flex justify-between">
                <Suspense fallback={"Welcome!"}>
                    <Username />
                </Suspense>

                <form action={logOut} className="flex items-center">
                    <button>로그아웃</button>
                </form>
            </div>

            <div className="flex flex-col gap-3 h-80">
                <h1 className="px-5 text-xl font-bold">판매 등록 제품</h1>
                {initialProducts.length <= 0 && <div className="w-full h-screen flex items-center justify-center text-center text-xl">등록된 제품이 없습니다.</div>}
                <UserProductList userId={user.id} initialProducts={initialProducts} />
            </div>

            {/* <div className="flex flex-col gap-3 h-80">
                <h1 className="px-5 text-xl font-bold">리뷰</h1>
                <div className="w-full text-center">미구현</div>
            </div> */}
        </div>
    );
}