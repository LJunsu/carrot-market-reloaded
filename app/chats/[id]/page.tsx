import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
    const room = await db.chatRoom.findUnique({
        where: {
            id: id
        },
        include: {
            users: {
                select: {id: true}
            }
        }
    });

    if(room) {
        const session = await getSession();
        const canSee = Boolean(room.users.find(user => user.id === session.id!))
        if(!canSee) {
            return null
        }
    }
    
    return room;
}

async function isReadMessage(chatRoomId: string, userId: number) {
    await db.message.updateMany({
        where: {
            chatRoomId: chatRoomId,
            isRead: false,
            NOT: {
                userId: userId
            }
        },
        data : {
            isRead: true
        }
    })
}

async function getMessages(chatRoomId: string) {
    const messages = await db.message.findMany({
        where: {
            chatRoomId: chatRoomId
        },
        select: {
            id: true,
            payload: true,
            created_at: true,
            updated_at: true,
            userId: true,
            user: {
                select: {
                    avatar: true,
                    username: true
                }
            }
        }
    });

    return messages;
}

async function getUserProfile() {
    const session = await getSession();
    const user = await db.user.findUnique({
        where: {
            id: session.id!
        },
        select: {
            username: true,
            avatar: true
        }
    })

    return user;
}

export type InitalChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

interface ChatRoomProps {
    params: Promise<{id: string}>;
}
export default async function ChatRoom({params}: ChatRoomProps) {
    const {id} = await params;

    const room = await getRoom(id);
    if(!room) {
        return notFound();
    }

    const session = await getSession();
    if(!session) {
        return notFound();
    }

    await isReadMessage(id, session.id!);

    const initialMessages = await getMessages(id);

    const user = await getUserProfile();
    if(!user) {
        return notFound();
    }

    return (
        <ChatMessagesList 
            chatRoomId={id}
            userId={session.id!} 
            username={user.username}
            avatar={user.avatar || ""}
            initialMessages={initialMessages} 
        />
    )
}