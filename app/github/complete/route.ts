import db from "@/lib/db";
import { getAccessToken, getGitHubEmail, getGitHubProfile } from "@/lib/github";
import Login from "@/lib/login";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if(!code) {
        return new Response(null, {
            status: 400
        })
    }

    const {error, access_token} = await getAccessToken(code);
    if(error) {
        return new Response(null, {
            status: 400
        })
    }
    
    const {id, avatar_url, login} = await getGitHubProfile(access_token!);

    const [{email}] = await getGitHubEmail(access_token!);
    
    const user = await db.user.findUnique({
        where: {
            github_id: id + ""
        },
        select: {
            id: true
        }
    });
    if(user) {
        return Login(user.id);
    }
    
    const usernameCheck = await db.user.findUnique({
        where: {
            username: login
        },
        select: {
            id: true
        }
    });

    const newUser = await db.user.create({
        data: {
            username: usernameCheck ? login + "-gh" : login,
            github_id: id + "",
            avatar: avatar_url,
            email: email
        },
        select: {
            id: true
        }
    });
    return Login(newUser.id);
}