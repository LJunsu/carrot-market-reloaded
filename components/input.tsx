import { InputHTMLAttributes } from "react";

interface InputProps {
    errors?: string[];
    name: string;
    value?: string;
}
export default function Input(
    {
        errors = [], 
        name,
        value,
        ...rest
    } : InputProps & InputHTMLAttributes<HTMLInputElement>
) {

    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                className="
                    bg-transparent rounded-md w-full h-10 
                    border-none focus:outline-none
                    ring-2 focus:ring-4 transition
                    ring-neutral-200 focus:ring-orange-500
                    placeholder:text-neutral-400"
                {...rest} 
                defaultValue={value}
            />

            {errors.map((error, index) => (
                <span 
                    key={index}
                    className="text-red-500 font-medium"
                >{error}</span>
            ))}
        </div>
    );
}