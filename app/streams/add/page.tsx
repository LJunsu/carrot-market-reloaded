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
                placeholder="Title or your stream."
                errors={state?.formErrors}
            />
            <Button text="Start streaming" />
        </form>
    )
}