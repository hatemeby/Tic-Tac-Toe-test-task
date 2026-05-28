
export function randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}

export function convertDate(date: number): string {
    const convertedDate = new Date(date).toLocaleString('en-US');
    return convertedDate;
}

export function firstCharCapitilized(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
