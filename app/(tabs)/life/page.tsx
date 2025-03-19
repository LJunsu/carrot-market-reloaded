import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { ChatBubbleBottomCenterIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
// import { unstable_cache } from "next/cache";
import Link from "next/link";

async function getPosts() {
    const posts = await db.post.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            views: true,
            created_at: true,
            _count: {
                select: {
                    comments: true,
                    likes: true
                }
            }
        }
    });

    return posts;
}

// const getCachedPost = unstable_cache(getPosts, ["post"], {revalidate: 60, tags: ["post"]})

export const metadata = {
    title : "동네생활"
}
export default async function Life() {
    const posts = await getPosts();
    // const posts = await getCachedPost();

    return (
        <div className="p-5 flex flex-col">
            {!posts || posts.length === 0 
            ? (
                <div className="w-full h-screen flex items-center justify-center text-center text-xl">
                    게시글이 없습니다.
                </div>) 
            : (null)}
            
            {posts.map((post) => (
                <Link 
                    key={post.id} href={`/posts/${post.id}`}
                    className="
                    pb-5 mb-5 border-b border-neutral-500 text-neutral-400 
                    flex flex-col gap-2 last:pb-0 last:border-b-0"
                >
                    <h2 className="text-white text-lg font-semibold">
                        {post.title}
                    </h2>

                    <p>{post.description}</p>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4 items-center">
                            <span>
                                {formatToTimeAgo(post.created_at.toString())}
                            </span>
                            <span>·</span>
                            <span>조회 {post.views}</span>
                        </div>

                        <div className="
                            flex gap-4 items-center 
                            *:flex *:gap-1 *:items-center"
                        >
                            <span>
                                <HandThumbUpIcon className="size-4" />
                                {post._count.likes}
                            </span>

                            <span>
                                <ChatBubbleBottomCenterIcon className="size-4" />
                                {post._count.comments}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}

            <Link 
                href="/life/add" 
                className="bg-orange-500 flex items-center justify-center 
                rounded-full size-14 fixed bottom-24 text-white
                transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    );
}