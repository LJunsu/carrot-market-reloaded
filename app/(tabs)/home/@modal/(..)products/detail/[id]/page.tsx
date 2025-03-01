import ModalCloseButton from "@/components/modal-close-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

async function getModalProduct(id: number) {

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

async function getIsOwner(userId: number) {
    const session = await getSession();
    if(session.id) {
        return session.id === userId;
    }

    return false;
}

interface ModalProductProps {
    params: Promise<{id: string}>;
}
export default async function Modal({params}: ModalProductProps) {
    const { id } = await params;
    const numberId = Number(id);
    if(isNaN(numberId)) return notFound();

    const product = await getModalProduct(numberId);
    if(!product) return notFound();

    const isOwner = await getIsOwner(product.userId);

    const productDelete = async () => {
        "use server";

        const session = await getSession();
        if(session.id !== product.userId) {
            return
        }

        await db.product.delete({
            where: {
                id: product.id
            }
        });

        revalidateTag("products");
        redirect("/home");
    }

    return (
        <div 
            className="
                absolute w-full h-full z-50 flex justify-center items-center
                bg-black bg-opacity-60 left-0 top-0"
        >
            <div className="max-w-screen-sm w-full flex justify-center flex-col gap-2 bg-neutral-800 p-5 rounded-lg">
                <ModalCloseButton />

                <div className="w-full py-2 flex justify-between">
                    <div className="flex gap-3">
                        <div className="relative size-10">
                            {product.user.avatar !== null 
                            ? <Image
                                className="w-full h-full object-fill rounded-full" fill
                                src={product.user.avatar} alt={product.user.username}
                            />
                            : <UserIcon />}
                        </div>

                        <div className="flex items-center">{product.user.username}</div>
                    </div>

                    {isOwner 
                    ? <>
                        <form action={productDelete}>
                            <button className="
                                bg-red-500 p-2
                                rounded-md text-white font-semibold"
                            >삭제</button>
                        </form>

                        <Link 
                            className="
                                bg-orange-500 p-2
                                rounded-md text-white font-semibold" 
                            href={`/products/detail/${id}/edit`}
                        >수정</Link>
                    </>
                    : <Link 
                        className="
                            bg-orange-500 p-2
                            rounded-md text-white font-semibold" 
                        href={``}
                    >채팅</Link>}
                </div>

                <div 
                    className="
                        aspect-square bg-neutral-700 text-neutral-200 
                        rounded-md flex justify-center items-center"
                >
                    <div className="
                        relative w-full h-full rounded-lg
                        flex items-center justify-center overflow-hidden"
                    >
                        {product.photo === null
                        ? <PhotoIcon className="h-28" />
                        : <Image 
                            fill src={product.photo} alt={product.title} 
                            className="w-full h-full object-fill"
                        />}
                    </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold">{product.title}</h1>
                        <span className="font-semibold text-2xl">{formatToWon(product.price)} 원</span>
                    </div>

                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    )
}