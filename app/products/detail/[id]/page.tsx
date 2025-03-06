import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createChatRoom } from "./actions";

async function getIsOwner(userId: number) {
    const session = await getSession();
    if(session.id) {
        return session.id === userId;
    }

    return false;
}

async function getProduct(id: number) {
    const product = await db.product.findUnique({
        where: {
            id
        },
        include: {
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

export async function generateMetadata({params}: ProductDetailPageProps) {
    const {id} = await params;

    const product = await getProduct(Number(id));

    return {
        title: product?.title
    }
}

interface ProductDetailPageProps {
    params: Promise<{id: string}>;
}
export default async function ProductDetail({params}: ProductDetailPageProps) {
    const { id } = await params;
    const numberId = Number(id);
    if(isNaN(numberId)) {
        return notFound();
    }

    const product = await getProduct(numberId);
    if(!product) {
        return notFound();
    }

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
        <div>
            <div className="relative aspect-square">
                <Image 
                    fill src={product.photo} alt={product.title} 
                    className="object-cover" 
                />
            </div>

            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                    {product.user.avatar !== null 
                    ? <Image 
                        src={product.user.avatar} 
                        alt={product.user.username} 
                        width={40} height={40} />
                    : <UserIcon />}
                </div>

                <div>
                    <h3>{product.user.username}</h3>
                </div>
            </div>

            <div className="p-5">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
            </div>

            <div 
                className="fixed w-full bottom-0 left-0 p-5 pb-10
                bg-neutral-800 flex justify-between items-center"
            >
                <span className="font-semibold text-lg1">{formatToWon(product.price)} 원</span>
                
                {isOwner 
                ? <>
                    <form action={productDelete}>
                        <button className="bg-red-500 px-5 py-2.5 
                            rounded-md text-white font-semibold"
                        >삭제</button>
                    </form> 

                    <Link 
                            className="
                                bg-orange-500 px-5 py-2.5 
                                rounded-md text-white font-semibold" 
                            href={`/products/detail/${id}/edit`}
                        >수정</Link>
                </>
                : <form action={createChatRoom}>
                    <input type="hidden" name="productUserId" value={product.userId} />
                      
                    <button 
                        className="bg-orange-500 px-5 py-2.5 
                        rounded-md text-white font-semibold" 
                    >채팅하기</button>
                </form>}
            </div>
        </div>
    )
}