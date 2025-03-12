"use client";

import { productDelete } from "@/app/(tabs)/home/@modal/(..)products/detail/[id]/actions";

interface ProductDeleteButtonProps {
    userId: number;
    productId: number;
    productUserId: number;
}
export default function ProductDeleteButton({ userId, productId, productUserId }: ProductDeleteButtonProps) {
    const productDeleteHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await productDelete(userId, productId, productUserId);
        if(result?.success) {
            window.location.href = "/home";
        } else {
            alert("권한이 없습니다.");
        }
    }

    return (
        <form onSubmit={productDeleteHandler}>
            <button className="
                bg-red-500 p-2
                rounded-md text-white font-semibold"
            >삭제</button>
        </form>
    )
}