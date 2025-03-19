import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import Link from "next/link";

async function getInitialProduct() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 3,
        orderBy: {
            created_at: "desc"
        }
    });

    return products;
};

const getCachedProduct = unstable_cache(getInitialProduct, ["priducts"], {tags: ["products"]});

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProduct>;

export const metadata = {
    title: "Home"
}

export default async function Products() {
    const initialProducts = await getCachedProduct();

    return (
        <div className="p-5 pb-20 flex flex-col gap-5">
            {/* {initialProducts.length <= 0 && <div className="w-full h-screen flex items-center justify-center text-center text-xl">등록된 제품이 없습니다.</div>} */}
            {!initialProducts || initialProducts.length === 0 
            ? (
                <div className="w-full h-screen flex items-center justify-center text-center text-xl">
                    등록된 제품이 없습니다.
                </div>) 
            : (null)}

            <ProductList initialProducts={initialProducts} />

            <Link 
                href="/products/add" 
                className="bg-orange-500 flex items-center justify-center 
                rounded-full size-14 fixed bottom-24 text-white
                transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    )    
}