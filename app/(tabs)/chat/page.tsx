import ChatRoomList from "@/components/chat-room-list";
import db from "@/lib/db";
import getSession from "@/lib/session"
import { notFound } from "next/navigation";

const getChatRooms = async (userId: number) => {
    const chatRooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        }, 
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            },
            messages: {
                orderBy: {
                    created_at: "desc"
                }
            }
        }
    });

    const filteredChatRooms = chatRooms.map((room) => ({
        ...room,
        users: room.users.filter(user => user.id !== userId)
    }));

    return filteredChatRooms;
}

const getNotReadMessage = async (userId: number) => {
    const chatRooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        },
        include: {
            messages: {
                where: {
                    isRead: false,
                    NOT: {
                        userId: userId
                    }
                },
                orderBy: {
                    created_at: "desc"
                }
            }
        }
    });

    const chatRoomWithUnreadMessages = chatRooms.map((room) => ({
        chatRoomId: room.id,
        unreadMessagesCount: room.messages.length
    }));

    return chatRoomWithUnreadMessages;
}

export const metadata = {
    title : "채팅"
}

export default async function Chat() {
    const session = await getSession();
    if(!session.id) {
        return notFound();
    }

    const chatRoomList = await getChatRooms(session.id);

    const notReadMessage = await getNotReadMessage(session.id);

    return (
        <div className="flex flex-col gap-3 py-5">
            {chatRoomList.length > 0
            ? chatRoomList.map((chatRoom, index) => (
                <ChatRoomList key={chatRoom.id} chatRoom={chatRoom} notReadMessage={notReadMessage[index]} />
            ))
            : <div className="w-full h-screen flex items-center justify-center text-center text-xl">채팅이 없습니다.</div>}
        </div>
    )    
}