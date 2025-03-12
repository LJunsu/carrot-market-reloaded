"use client";

import saveMessage from "@/app/chats/[id]/actions";
import { InitalChatMessages } from "@/app/chats/[id]/page"
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react"
import Button from "./button";

const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqeXRwYnBzZXRpb3pzY2VnaGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNjk4NDIsImV4cCI6MjA1Njc0NTg0Mn0.W9YqHQx2J75TL-qd7eO6HD-ozMgWPbuCbCHTZcHSwIU";
const SUPABASE_URL = "https://fjytpbpsetiozsceghgt.supabase.co";

interface ChatMessageListProps {
    chatRoomId: string;
    userId: number;
    username: string;
    avatar: string;
    initialMessages: InitalChatMessages;
}
export default function ChatMessagesList({chatRoomId, userId, username, avatar, initialMessages}: ChatMessageListProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState("");

    // const channel = useRef<RealtimeChannel>();
    const channel = useRef<RealtimeChannel>(null);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;

        setMessage(value);
      };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setMessages((prevMsgs) => [...prevMsgs, {
            id: Date.now(),
            payload: message,
            created_at: new Date(),
            updated_at: new Date(),
            userId: userId,
            user: {
                username: "xxx",
                avatar: "xxx"
            }
        }]);

        channel.current?.send({
            type: "broadcast",
            event: "message",
            payload: {
                id: Date.now(), 
                payload: message, 
                created_at: new Date(), 
                userId,
                user: {
                    username: username,
                    avatar: avatar
                }
            }
        });

        await saveMessage(message, chatRoomId);

        setMessage("");
    };

    useEffect(() => {
        const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

        channel.current = client.channel(`room-${chatRoomId}`);

        channel.current.on("broadcast", {event: "message"}, (payload) => {
            setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
        }).subscribe();

        return () => {
            channel.current?.unsubscribe();
        }
    }, [chatRoomId]);

    return (
        <div className="relative p-5 flex flex-col gap-5 min-h-screen justify-end">
            {/* <div className="absolute w-full p-3 top-0 left-0">
                <Button text="거래 신청" />
            </div> */}

            {messages.map((message) => (
                <div 
                    key={message.id} 
                    className={
                        `flex gap-4 items-start 
                        ${message.userId === userId ? "justify-end" : ""}`
                    }
                >
                    {message.userId === userId
                        ? null
                        :<div className="flex flex-col gap-1 h-full items-center">
                            {message.user.avatar
                            ? <Image
                                src={message.user.avatar!}
                                alt={message.user.username}
                                width={50} height={50}
                                className="size-8 rounded-full"
                            />
                            : <UserIcon className="size-8 object-fill rounded-full" />}

                            <div>{message.user.username}</div>
                        </div>
                    }
                    
                    <div 
                        className={
                            `flex flex-col gap-1 
                            ${message.userId === userId
                                ? "items-end" : ""
                            }`
                        }
                    >
                        <span 
                            className={
                                `p-2.5 rounded-md
                                ${message.userId === userId 
                                    ? "bg-neutral-400"
                                    : "bg-orange-500"
                                }`
                            }>
                            {message.payload}
                        </span>

                        <span className="text-xs">
                            {formatToTimeAgo(message.created_at.toString())}
                        </span>
                    </div>
                </div>
            ))}

            <form className="flex relative" onSubmit={onSubmit}>
                <input
                    required
                    onChange={onChange}
                    value={message}
                    type="text"
                    name="message"
                    placeholder="메시지를 입력하세요."
                    className="
                        bg-transparent rounded-full w-full h-10 
                        focus:outline-none px-5 ring-2 focus:ring-4 
                        transition ring-neutral-200 focus:ring-neutral-50 
                        border-none placeholder:text-neutral-400"
                />

                <button className="absolute right-0">
                    <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
                </button>
            </form>
        </div>
    )
}