import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";

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

    const { likeCount, isLiked } = await getCachedLikeStatus(numberId);
    console.log(isLiked);

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
        </div>
    )
}