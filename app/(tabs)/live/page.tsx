import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

async function getLives() {
    const lives = await db.liveStream.findMany({
        select: {
            id:true,
            title: true,
            created_at: true,
            user: {
                select: {
                    avatar: true,
                    username: true
                }
            }
        }
    });

    return lives;
}

export default async function Live() {
    const lives = await getLives(); 

    return (
        <div>
            <div className="*:text-white">
                {lives.length <= 0 && <div className="w-full h-screen flex items-center justify-center text-center text-xl">방송이 없습니다.</div>}

                {lives.map((live) => (
                    <Link 
                        href={`/streams/${live.id}`} key={live.id}
                        className="
                            px-3 py-5 flex justify-between gap-2
                            border-b border-neutral-500 text-neutral-400 
                            last:pb-0 last:border-b-0"
                    >
                            <div className="flex items-center w-3/7">{live.title}</div>

                            <div className="flex gap-3 items-center w-2/7">
                                {
                                    live.user.avatar
                                    ? <Image 
                                        src={live.user.avatar!}
                                        alt={live.user.username}
                                        width={32} height={32}
                                        className="rounded-full"
                                    />
                                    : <UserIcon className="size-8 rounded-full" />
                                }

                                <div className="flex items-center">{live.user.username}</div>
                            </div>
                            
                            <div className="flex items-center w-2/7">{formatToTimeAgo(live.created_at.toString())}</div>
                    </Link>
                ))}
            </div>

            <Link 
                href="/streams/add" 
                className="bg-orange-500 flex items-center justify-center 
                rounded-full size-14 fixed bottom-24 right-8 text-white
                transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    )    
}