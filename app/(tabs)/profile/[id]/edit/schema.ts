import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import { z } from "zod";

export const profileUpdateSchema = z.object({
    id: z.number(),
    avatar: z.string().nullable(),
    username: z.string(),
    phone: z.string().nullable(),
    nextPassword: z.string().
    min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
    .optional().or(z.literal("")),
    checkPassword: z.string()
    .min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
    .optional().or(z.literal(""))
}).refine((data) => {
        if(!data.nextPassword && !data.checkPassword) return true;
        return data.nextPassword === data.checkPassword;
    }, {
        message: "두 비밀번호가 일치하지 않습니다.",
        path: ["checkPassword"]
    }
)

export type ProfileType = z.infer<typeof profileUpdateSchema>;