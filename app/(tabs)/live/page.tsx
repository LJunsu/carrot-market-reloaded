import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { PlusIcon } from "@heroicons/react/24/solid";
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
                {lives.map((live) => (
                    <Link 
                        href={`/streams/${live.id}`} key={live.id}
                        className="py-5 flex justify-between gap-2
                            border-b border-neutral-500 text-neutral-400 
                            last:pb-0 last:border-b-0"
                    >
                            <div>{live.title}</div>

                            <div className="flex gap-3">
                                <Image 
                                    src={live.user.avatar!}
                                    alt={live.user.username}
                                    width={30} height={30}
                                    className="rounded-full"
                                />

                                <div>{live.user.username}</div>
                            </div>
                            
                            <div>{formatToTimeAgo(live.created_at.toString())}</div>
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