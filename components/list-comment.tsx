import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";

interface ListCommentProps {
    comment: {
        id: number;
        payload: string;
        updated_at: Date;
        user: {
            username: string;
            avatar: string | null;
        }
    }
}
export default function ListComment({comment}: ListCommentProps) {

    return (
        <div 
            className="
                flex flex-col gap-3 w-full my-3 pb-5
                border-b border-neutral-500"
        >
            <div className="flex justify-between *:text-sm">
                <div className="flex gap-3 ">
                    <div className="flex relative size-7">
                        <Image 
                            fill 
                            src={comment.user.avatar ? comment.user.avatar : "/default-profile-image.png"} alt={comment.user.username}
                            className="rounded-full object-cover"
                        />
                    </div>

                    <div className="flex items-center font-semibold">
                        {comment.user.username}
                    </div>
                </div>

                <span className="flex items-center text-neutral-400">
                    {formatToTimeAgo(comment.updated_at.toString())}
                </span>
            </div>

            <p>{comment.payload}</p>
        </div>
    );
}