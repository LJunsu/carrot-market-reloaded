import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import { Suspense } from "react";
import ListCommentSkeleton from "@/components/list-comment-skeleton";
import ListCommentWithForm from "@/components/list-comment-form";

async function getPost(id: number) {
    try {
        const post = await db.post.update({
            where: {
                id
            },
            data: {
                views: {
                    increment: 1
                }
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });
    
        return post;
    } catch {
        return null;
    }
}

const getCachedPost = unstable_cache(getPost, ["post-detail"], {
    tags: ["post-detail"],
    revalidate: 60
});

async function getLikeStatus(postId: number, userId: number) {
    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId: postId,
                userId: userId
            }
        }
    });

    const likeCount = await db.like.count({
        where: {
            postId
        }
    });

    return {
        likeCount, isLiked: Boolean(isLiked)
    }
}

async function getCachedLikeStatus(postId: number) {
    const session = await getSession();
    const userId = session.id;
    
    const cachedOperation = 
        unstable_cache(getLikeStatus, ["product-like-status"], {
            tags: [`like-status-${postId}`]
        }
    );

    return cachedOperation(postId, userId!);
}

async function getComment(id: number) {
    const comments = await db.comment.findMany({
        where: {
            postId: id
        },
        select: {
            id: true,
            payload: true,
            updated_at: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            }
        }
    });

    return comments;
}

const getCachedComment = unstable_cache(getComment, ["post-detail"], {
    tags: ["post-detail"]
})

interface PostDetailPageProps {
    params: Promise<{id: string}>;
}
export default async function PostDetail({params}: PostDetailPageProps) {
    const {id} = await params;
    const numberId = Number(id);
    if(isNaN(numberId)) {
        return notFound();
    }

    const post = await getCachedPost(numberId);
    if(!post) {
        return notFound();
    }

    const userId = (await getSession()).id;
    if(!userId) {
        return notFound();
    }

    const comments = await getCachedComment(numberId);

    const { likeCount, isLiked } = await getCachedLikeStatus(numberId);

    return (
        <div className="p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={post.user.avatar!}
                    alt={post.user.username}
                />

                <div>
                    <span className="text-sm font-semibold">{post.user.username}</span>

                    <div className="text-xs">
                        <span>{formatToTimeAgo(post.created_at.toString())}</span>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold">{post.title}</h2>

            <p className="mb-5">{post.description}</p>

            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5" />
                    <span>조회 {post.views}</span>
                </div>

                <LikeButton isLiked={isLiked} likeCount={likeCount} postId={numberId} />
            </div>

            <Suspense fallback={<ListCommentSkeleton />}>
                <ListCommentWithForm comments={comments} postId={numberId} userId={userId} />

                {/* <div className="flex flex-col my-6">
                    <div className="flex flex-col">
                        {comments
                            ? comments.map((comment) => <ListComment key={comment.id} comment={comment} />)
                            : <span>댓글이 없습니다.</span>
                        }
                    </div>

                    <div>
                        <form action={commentPost} className="flex flex-col gap-3">
                            <input 
                                type="text" name="userId"
                                defaultValue={userId}
                                className="hidden" readOnly 
                            />

                            <input 
                                type="text" name="postId"
                                defaultValue={numberId}
                                className="hidden" readOnly 
                            />

                            <textarea
                                name="comment" 
                                className="
                                bg-transparent rounded-md w-full h-20 
                                border-none focus:outline-none
                                ring-2 focus:ring-4 transition
                                ring-neutral-200 focus:ring-orange-500
                                placeholder:text-neutral-400"
                            />

                            <button 
                                className="
                                primary-btn h-10 
                                disabled:bg-neutral-400 disabled:text-neutral-300 
                                disabled:cursor-not-allowed"
                            >댓글 작성</button>
                        </form>
                    </div>
                </div> */}
            </Suspense>
        </div>
    )
}