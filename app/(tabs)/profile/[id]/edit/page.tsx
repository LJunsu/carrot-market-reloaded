import ProfileEditForm from "@/components/profile-edit";
import db from "@/lib/db";
import { notFound } from "next/navigation";

async function getProfile(id: number) {
    const profile = db.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            username: true,
            password: true,
            phone: true,
            avatar: true,
            github_id: true
        }
    });

    return profile;
}

interface ProfileEditProps {
    params: Promise<{id: string}>;
}
export default async function ProfileEdit({params}: ProfileEditProps) {
    const {id} = await params;
    const numberId = Number(id);
    if(isNaN(numberId)) return notFound();

    const profile = await getProfile(numberId);
    if(!profile) return notFound();

    return (
        <div className="p-5 flex flex-col gap-3">
            <div className="text-2xl">프로필 수정</div>
            <ProfileEditForm profile={profile} />
        </div>
    )
}