export {
    getAccessToken, getGitHubProfile, getGitHubEmail
}

interface AccessToken {
    error?: string;
    access_token?: string;
}
async function getAccessToken(code: string): Promise<AccessToken> {
    let accessTokenUrl = "https://github.com/login/oauth/access_token";

    const accessTokenParmas = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code: code
    }).toString();

    accessTokenUrl = `${accessTokenUrl}?${accessTokenParmas}`;

    const accessTokenResponse = await fetch(accessTokenUrl, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    });
    const json: AccessToken = await accessTokenResponse.json();
    return json;
}

interface GitHubProfile {
    id: string;
    avatar_url: string;
    login: string;
}
async function getGitHubProfile(access_token: string): Promise<GitHubProfile> {
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    });
    const json: GitHubProfile = await userProfileResponse.json();
    return json;
}

interface GitHubEmail {
    email?: string
}
async function getGitHubEmail(access_token: string): Promise<GitHubEmail[]> {
    const userEmailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    });
    const json: GitHubEmail[] = await userEmailResponse.json();
    return json;
}