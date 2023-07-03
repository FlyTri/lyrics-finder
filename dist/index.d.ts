type Data = {
    songwriters: string | undefined;
    title: string | undefined;
    released: string | undefined;
    artist: string | null;
    album: string | null;
    genres: string | undefined;
    lyrics: string | undefined;
};
export declare function find(name: string, moreInfo?: boolean, language?: string): Promise<Data | null>;
export {};
