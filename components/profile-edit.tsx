"use client";

import { isCheckPassword, updateProfile } from "@/app/(tabs)/profile/[id]/edit/actions";
import { ProfileType, profileUpdateSchema } from "@/app/(tabs)/profile/[id]/edit/schema";
import { getUploadUrl } from "@/app/products/add/actions";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./input";
import Button from "./button";

type InitProfile = {
    id: number,
    username: string,
    password: string | null,
    avatar: string | null,
    phone: string | null,
    github_id: string | null
}
interface ProfileEditFormProps {
    profile: InitProfile;
}
export default function ProfileEditForm({profile}: ProfileEditFormProps) {
    const [preview, setPreview] = useState("");
    const [uplodaUrl, setUploadUrl] = useState("");
    const [imageId, setImageId] = useState("");
    const [IsCheckPassword, setIsCheckPassword] = useState(false);

    const {register, setValue} = useForm<ProfileType>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            username: "",
            phone: ""
        }
    });

    useEffect(() => {
        setPreview(`${profile!.avatar}`);
        setValue("username", profile!.username);
        setValue("phone", profile!.phone);
    }, [profile])


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
        const file = formData.get("avatar");
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
            formData.set("avatar", `${photoUrl}/public`);
        } else {
            formData.set("avatar", "");
        }
        return updateProfile(_, formData);
    }
    
    const [state, action] = useActionState(interceptAction, null);

    const getCheckPassword = async (_: unknown, formData: FormData) => {
        setPasswordCheckError([]);
        const isCheck = await isCheckPassword(formData);
        
        if(isCheck) {
            setIsCheckPassword(true);
        } else {
            setPasswordCheckError(["비밀번호가 일치하지 않습니다."]);
        }
    }

    const [passwordCheckError, setPasswordCheckError] = useState<string[]>([]);
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [checkPasswordState, checkPasswordAction] = useActionState(getCheckPassword, null);

    if(IsCheckPassword) {
        return (
            <form action={action} 
            className="flex flex-row justify-between gap-3 sm:flex-col">
                <div className="w-1/2 sm:w-full">
                    <label 
                        htmlFor="avatar" 
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
                            </div>
                        </> : null}
                    </label>
                    
                    <input 
                        onChange={onImageChange}
                        type="file" id="avatar" name="avatar" accept="image/*"
                        className="hidden"
                    />
        
                    <input 
                        type="text" name="userId" className="hidden" defaultValue={profile.id}
                    />
                </div>
                            
                <div className="w-1/2 sm:mb-20 flex flex-col justify-between sm:w-full sm:gap-3">
                    <Input
                        type="text"
                        required
                        placeholder="닉네임"
                        {...register("username")}
                        errors={state?.fieldErrors && "username" in state.fieldErrors ? state.fieldErrors.username : undefined}
                    />
        
                    <Input
                        type="text"
                        placeholder="전화번호"
                        {...register("phone")}
                        errors={state?.fieldErrors && "phone" in state.fieldErrors ? state.fieldErrors.phone : undefined}
                    />
        
                    <Input
                        type="password"
                        placeholder="변경할 비밀번호"
                        {...register("nextPassword")}
                        errors={state?.fieldErrors && "nextPassword" in state.fieldErrors ? state.fieldErrors.nextPassword : undefined}
                    />
        
                    <Input
                        type="password"
                        placeholder="변경할 비밀번호 확인"
                        {...register("checkPassword")}
                        errors={state?.fieldErrors && "checkPassword" in state.fieldErrors ? state.fieldErrors.checkPassword : undefined}
                    />
        
                    <Button text="프로필 수정" />
                </div>
            </form>
        )
    } else {
        return (
            <div className="flex flex-col gap-3">
                <div>패스워드를 입력하세요.</div>

                <form action={checkPasswordAction} className="flex flex-col gap-3">
                    <Input 
                        type="password" 
                        name="password" 
                        placeholder="패스워드를 입력하세요."
                        errors={passwordCheckError}
                    />

                    <Button text="비밀번호 확인" />
                </form>
            </div>
        )
    }
}