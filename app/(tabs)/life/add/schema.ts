import { z } from "zod";

export const postSchema = z.object({
    title: z.string({
        required_error: "제목을 입력하세요."
    }).min(3, {
        message: "3글자 이상, 2000글자 이하로 입력하세요."
    }).max(30, {
        message: "3글자 이상, 2000글자 이하로 입력하세요."
    }),
    description: z.string({
        required_error: "내용을 입력하세요."
    }).min(3, {
        message: "3글자 이상, 2000글자 이하로 입력하세요."
    }).max(2000, {
        message: "3글자 이상, 2000글자 이하로 입력하세요."
    })
})

export type PostType = z.infer<typeof postSchema>;