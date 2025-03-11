import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import { z } from "zod";

const checkPasswords = 
    ({nextPassword, checkPassword}: {nextPassword: string, checkPassword: string}) => 
        nextPassword === checkPassword

export const profileUpdateSchema = z.object({
    id: z.number(),
    avatar: z.string().nullable(),
    username: z.string(),
    phone: z.string().nullable(),
    prevPassword: z.string(),
    nextPassword: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    checkPassword: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
}).refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["checkPassword"]
})

export type ProfileType = z.infer<typeof profileUpdateSchema>;