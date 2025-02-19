import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProduct() {
    const products = await db.product.findMany({
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

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProduct>;

export default async function Products() {
    const initialProducts = await getInitialProduct();

    return (
        <div className="p-5 flex flex-col gap-5">
            <ProductList initialProducts={initialProducts} />
        </div>
    )    
}