"use client";

import { commentPost } from "@/app/posts/[id]/actions";
import ListComment from "./list-comment";
import { startTransition, useOptimistic, useState } from "react";
import userInfoSelect from "@/lib/user";

interface ListCommentWithFormProps {
    comments: {
        id: number;
        updated_at: Date;
        user: {
            id: number;
            username: string;
            avatar: string | null;
        };
        payload: string;
    }[];
    postId: number;
    userId: number;
}
export default function ListCommentWithForm({comments, postId, userId}: ListCommentWithFormProps) {
    const [optimisticComments, addOptimisticComment] = useOptimistic(comments);
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const comment = String(formData.get("comment"));
        if(!comment || comment.length < 3) {
            setCommentError("댓글은 3글자 이상 입력해야 합니다.")
            return;
        }

        const userInfo = await userInfoSelect(userId);

        const newComment = {
            id: 9999,
            updated_at: new Date(),
            user: {
                id: userId,
                username: userInfo!.username,
                avatar: userInfo!.avatar, 
            },
            payload: comment || ""
        }

        startTransition(() => {
            addOptimisticComment((prev) => [...prev, newComment]);
        });

        setCommentText("");

        await commentPost(formData);
    }

    return (
        <div className="flex flex-col my-6 gap-3">
            <div className="flex flex-col">
                {optimisticComments.length > 0
                    ? optimisticComments.map((comment) => <ListComment key={comment.id} comment={comment} />)
                    : <span>댓글이 없습니다.</span>
                }
            </div>

            <div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input 
                        type="text" name="userId"
                        defaultValue={userId}
                        className="hidden" readOnly 
                    />

                    <input 
                        type="text" name="postId"
                        defaultValue={postId}
                        className="hidden" readOnly 
                    />

                    <textarea
                        name="comment" 
                        value={commentText}
                        onChange={(e) => {
                            setCommentError("")
                            setCommentText(e.target.value)}
                        }
                        className="
                        bg-transparent rounded-md w-full h-20 
                        border-none focus:outline-none
                        ring-2 focus:ring-4 transition
                        ring-neutral-200 focus:ring-orange-500
                        placeholder:text-neutral-400"
                    />
                    {commentError
                    ? <div className="text-red-500 font-medium">{commentError}</div>
                    : null}

                    <button 
                        type="submit"
                        className="
                        primary-btn h-10 
                        disabled:bg-neutral-400 disabled:text-neutral-300 
                        disabled:cursor-not-allowed"
                    >댓글 작성</button>
                </form>
            </div>
        </div>
    );
}