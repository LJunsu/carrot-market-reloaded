"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "./schema";

export default function AddProduct() {
    const [preview, setPreview] = useState("");
    const [uplodaUrl, setUploadUrl] = useState("");
    const [imageId, setImageId] = useState("");

    const {register} = useForm<ProductType>({
        resolver: zodResolver(productSchema)
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
        if(!file) {
            return;
        }
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
        formData.set("photo", `${photoUrl}/public`);

        return uploadProduct(_, formData);
    }

    const [state, action] = useActionState(interceptAction, null);

    return (
        <div>
            <div className="w-full p-5 pt-10 text-2xl font-bold">
                제품 등록
            </div>

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

                <Button text="작성 완료" />
            </form>
        </div>
    )
}