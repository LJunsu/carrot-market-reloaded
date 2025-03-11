import { z } from "zod";

export const postSchema = z.object({
    title: z.string({
        required_error: "Title is required"
    }).min(3).max(30),
    description: z.string({
        required_error: "Description is required"
    }).min(3).max(2000)
})

export type PostType = z.infer<typeof postSchema>;