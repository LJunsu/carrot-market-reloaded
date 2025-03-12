import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/button";

async function getStream(id: number) {
    const stream = await db.liveStream.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            title: true,
            stream_key: true,
            stream_id: true,
            userId: true,
            user: {
                select: {
                    avatar: true,
                    username: true
                }
            }
        }
    });

    return stream;
}

interface StreamDetailPageProps {
    params: Promise<{id: string}>;
}
export default async function StreamDetail({params}: StreamDetailPageProps) {
    const { id } = await params;
    const numberId = Number(id);
    if(isNaN(numberId)) {
        return notFound();
    }

    const stream = await getStream(numberId);
    if(!stream) {
        return notFound();
    }

    const session = await getSession();

    const deleteAction = async () => {
        "use server";

        await db.liveStream.delete({
            where: {
                id: stream.id
            }
        });

        redirect("/live");
    }

    return (
        <div className="p-10">
            <div className="relative aspect-video">
                <iframe
                    src={`https://cloudflarestream.com/${stream.stream_id}/iframe`}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    className="w-full h-full rounded-md"
                ></iframe>
            </div>

            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                    {stream.user.avatar !== null ? (
                    <Image
                        src={stream.user.avatar}
                        width={40}
                        height={40}
                        alt={stream.user.username}
                    />
                    ) : (
                        <UserIcon className="size-10" />
                    )}
                </div>
                <div>
                    <h3>{stream.user.username}</h3>
                </div>
            </div>

            <div className="p-5">
                <h1 className="text-2xl font-semibold">{stream.title}</h1>
            </div>

            {stream.userId === session.id! 
                ? (<>
                <div className="flex flex-col gap-5 bg-yellow-200 text-black p-5 rounded-md *:break-words">
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">Stream URL</span>
                        <span>rtmps://live.cloudflare.com:443/live/</span>
                    </div>

                    <div className="flex flex-col gap-1 *:break-words">
                        <span className="font-semibold">Secret Key</span>
                        <span>{stream.stream_key}</span>
                    </div>
                </div>

                <form className="py-3" action={deleteAction}>
                    <Button text="삭제" />
                </form>
                </>)
                : null
            }
        </div>
    )
}