import { z } from "zod";

export const productUpdateSchema = z.object({
    photo: z.string(),
    title: z.string({
        required_error: "Title is required"
    }),
    description: z.string({
        required_error: "Description is required"
    }),
    price: z.coerce.number({
        required_error: "Price is required"
    })
})

export type ProductType = z.infer<typeof productUpdateSchema>;