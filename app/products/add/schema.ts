import { z } from "zod";

export const productSchema = z.object({
    photo: z.string({
        required_error: "이미지를 등록하세요."
    }),
    title: z.string({
        required_error: "제목을 입력하세요."
    }),
    description: z.string({
        required_error: "설명을 입력하세요."
    }),
    price: z.coerce.number({
        required_error: "가격을 입력하세요."
    })
})

export type ProductType = z.infer<typeof productSchema>;