"use client"

import Input from "@/components/input";
import { useForm } from "react-hook-form";
import { postSchema, PostType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/button";
import { useActionState } from "react";
import { uploadPost } from "./actions";

export default function LifeAdd() {
    const {register} = useForm<PostType>({
        resolver: zodResolver(postSchema)
    });

    const [state, action] = useActionState(uploadPost, null);

    return (
        <div>
            <div className="w-full p-5 pt-10 text-2xl font-bold">
                동네생활 작성
            </div>

            <form action={action} className="p-5 flex flex-col gap-5">
                <Input
                    type="text"
                    required
                    placeholder="제목을 입력하세요."
                    {...register("title")}
                    errors={state?.fieldErrors.title}
                />

                <div className="flex flex-col gap-2">
                    <textarea
                        className="
                        bg-transparent rounded-md w-full h-80
                        border-none focus:outline-none
                        ring-2 focus:ring-4 transition
                        ring-neutral-200 focus:ring-orange-500
                        placeholder:text-neutral-400"
                        required
                        placeholder="내용을 입력하세요."
                        {...register("description")}
                    />

                    {state?.fieldErrors.description 
                    ? state.fieldErrors.description.map((error, index) => (
                        <span 
                            key={index}
                            className="text-red-500 font-medium"
                        >{error}</span>
                    ))
                    : null   
                    }
                </div>

                <Button text="작성 완료" />
            </form>
        </div>
    )
}