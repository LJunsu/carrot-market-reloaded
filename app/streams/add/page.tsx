"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import { startStream } from "./actions";

export default function AddStream() {
    const [state, action] = useActionState(startStream, null);
    
    return (
        <form action={action} className="p-5 flex flex-col gap-2">
            <Input 
                name="title" 
                required 
                placeholder="스트리밍 제목을 입력하세요."
                errors={state?.formErrors}
            />
            <Button text="스트리밍 시작" />
        </form>
    )
}