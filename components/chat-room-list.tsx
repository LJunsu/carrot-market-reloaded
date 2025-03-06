"use client";

import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ChatRoomListProps {
    chatRoom: {
        users: {
            id: number;
            username: string;
            avatar: string | null;
        }[];
        messages: {
            id: number;
            created_at: Date;
            updated_at: Date;
            payload: string;
            isRead: boolean;
            chatRoomId: string;
            userId: number;
        }[];
        id: string;
        created_at: Date;
        updated_at: Date;
    };
    notReadMessage: {
        chatRoomId: string;
        unreadMessagesCount: number;
    };
}
export default function ChatRoomList({chatRoom, notReadMessage}: ChatRoomListProps) {

    return (
        <Link 
            key={chatRoom.id} href={`/chats/${chatRoom.id}`}
            className="
            w-full
            border-b border-neutral-500
            last:pb-0 last:border-b-0"
        >
            <div
                className="w-full flex justify-between py-5"
            >
                <div className="flex items-center gap-3 w-5/6">
                    <Image
                        width={50} height={50}
                        src={chatRoom.users[0].avatar}
                        alt={chatRoom.users[0].username}
                        className="size-10 rounded-full"
                    />

                    <div>
                        <div className="text-white font-bold text-lg">
                            {chatRoom.users[0].username}
                        </div>

                        <div className="text-neutral-400">
                            {chatRoom.messages[0]?.payload ?? "-"}
                        </div>
                    </div>
                </div>

                <div className="w-1/6 flex flex-col">
                {chatRoom.messages[0] 
                ? <>
                    <div className="text-neutral-400 flex justify-end">
                        {chatRoom.messages[0] ? formatToTimeAgo(chatRoom.messages[0].created_at.toString()) : "-"}
                    </div>

                    {notReadMessage.unreadMessagesCount > 0
                    ? <div className="text-white flex justify-end">새 메시지 +{notReadMessage.unreadMessagesCount}</div>
                    : <div className="text-neutral-400 flex justify-end">읽음</div>
                    }
                </>
                : null
                }
                </div>
            </div>
        </Link>
    )
}