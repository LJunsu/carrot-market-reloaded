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
import { getUploadUrl } from "@/app/products/add/actions";

export default function EditProduct() {
    const {id} = useParams();

    const [preview, setPreview] = useState("");
    const [uplodaUrl, setUploadUrl] = useState("");
    const [imageId, setImageId] = useState("");

    const {register, setValue} = useForm<ProductType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            price: 0,
            description: ""
        }
    });

    const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const {success, result} = await getUploadUrl();
        if(success) {
            const {id, uploadURL} = result;
            setUploadUrl(uploadURL);
            setImageId(id);
        }
    }

    const interceptAction = async (_: unknown, formData: FormData) => {
        const file = formData.get("photo");
        console.log(file);
        if(file instanceof File && file.size > 0) {
            const cloudflareForm = new FormData();
            cloudflareForm.append("file", file);

            const response = await fetch(uplodaUrl, {
                method: "POST",
                body: cloudflareForm
            });
            if(response.status !== 200) {
                return;
            }

            const photoUrl = `https://imagedelivery.net/PRjBLDB7Nrc6UjfrSGM0vw/${imageId}`;
            formData.set("photo", photoUrl);
        } else {
            formData.set("photo", "");
        }
        return updateProduct(_, formData);
    }

    const [state, action] = useActionState(interceptAction, null);

    const [productIdInp, setProductIdInp] = useState<string>("");

    useEffect(() => {
        const fetchProduct = async () => {
            const product = await updateInit(Number(id));
            setProductIdInp(String(id));
            setPreview(`${product!.photo}`);
            setValue("title", product!.title);
            setValue("price", product!.price);
            setValue("description", product!.description);
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
                />

                <Input
                    type="number"
                    required
                    placeholder="가격"
                    {...register("price")}
                    errors={state?.fieldErrors && "price" in state.fieldErrors ? state.fieldErrors.price : undefined}
                />

                <Input
                    type="text"
                    required
                    placeholder="자세한 설명"
                    {...register("description")}
                    errors={state?.fieldErrors && "description" in state.fieldErrors ? state.fieldErrors.description : undefined}
                />

                <Button text="수정 완료" />
            </form>
        </div>
    )
}