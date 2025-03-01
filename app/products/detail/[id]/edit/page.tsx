"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "@/app/products/add/schema";
import { updateProduct } from "./action";
import { useParams } from "next/navigation";
import updateInit from "@/lib/update-init";

export default function EditProduct() {
    const {id} = useParams();

    const [preview, setPreview] = useState("");

    const {register} = useForm<ProductType>({
        resolver: zodResolver(productSchema)
    });

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: {files}
        } = e;

        if(!files) {
            return;
        }

        const maxSizeMB = 3;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if(!files[0].type.startsWith("image/") || files[0].size > maxSizeBytes) {
            return;
        }

        const file = files[0];
        const url = URL.createObjectURL(file);
        setPreview(url);
    }

    const [state, action] = useActionState(updateProduct, null);

    const [productIdInp, setProductIdInp] = useState<string>("");
    const [productTitleInp, setProductTitleInp] = useState<string>("");
    const [productPriceInp, setProductPriceInp] = useState<number>(0);
    const [productDescriptionInp, setProductDescriptionInp] = useState<string>("");


    useEffect(() => {
        const fetchProduct = async () => {
            const product = await updateInit(Number(id));
            setProductIdInp(String(id));
            setPreview(product?.photo || "");
            setProductTitleInp(product?.title || "");
            setProductPriceInp(product?.price || 0);
            setProductDescriptionInp(product?.description || "");
        };

        if(id) {
            fetchProduct();
        }
    }, [id]);

    return (
        <div>
            <form action={action} className="p-5 flex flex-col gap-5">
                <label 
                    htmlFor="photo" 
                    className="border-2 aspect-square text-neutral-300
                    flex flex-col items-center justify-center rounded-md
                    border-neutral-300 border-dashed cursor-pointer
                    bg-center bg-cover"
                    style={{backgroundImage: `url(${preview})`}}
                >
                    {preview === "" 
                    ? <>
                        <PhotoIcon className="w-20" />

                        <div className="text-neutral-400 text-sm">
                            사진을 추가해주세요.
                            {state?.fieldErrors.photo}
                        </div>
                    </> : null}
                </label>

                <input 
                    onChange={onImageChange}
                    type="file" id="photo" name="photo" accept="image/*"
                    className="hidden"
                />

                <input 
                    type="text" id="productId" name="productId" value={productIdInp} className="hidden" readOnly
                />

                <Input
                    type="text"
                    required
                    placeholder="제목"
                    {...register("title")}
                    errors={state?.fieldErrors && "title" in state.fieldErrors ? state.fieldErrors.title : undefined}
                    value={productTitleInp}
                />

                <Input
                    type="number"
                    required
                    placeholder="가격"
                    {...register("price")}
                    errors={state?.fieldErrors && "price" in state.fieldErrors ? state.fieldErrors.price : undefined}
                    value={String(productPriceInp)}
                />

                <Input
                    type="text"
                    required
                    placeholder="자세한 설명"
                    {...register("description")}
                    errors={state?.fieldErrors && "description" in state.fieldErrors ? state.fieldErrors.description : undefined}
                    value={productDescriptionInp}
                />

                <Button text="수정 완료" />
            </form>
        </div>
    )
}