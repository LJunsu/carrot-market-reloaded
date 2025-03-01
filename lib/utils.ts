export function formatToTimeAgo(date: string): string {
    const time = new Date(date).getTime();
    const now = Date.now();
    // const now = typeof window !== 'undefined' ? performance.now() : Date.now();

    const minutesInMs = 1000 * 60;
    const minutes = Math.round((now - time) / minutesInMs);

    const hoursInMs = 1000 * 60 * 60;
    const hours = Math.round((now - time) / hoursInMs);

    const dayInMs = 1000 * 60 * 60 * 24;
    const days = Math.round((now - time) / dayInMs);
    
    const formatter = new Intl.RelativeTimeFormat("ko");
    if(minutes < 60) {
        return formatter.format(-minutes, "minutes");
    } else if(hours < 24) {
        return formatter.format(-hours, "hours");
    } else {
        return formatter.format(-days, "days");
    }
}

export function formatToWon(price: number): string {
    return price.toLocaleString("ko-KR");
}