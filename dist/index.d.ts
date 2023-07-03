type Data = {
    songwriters: string | undefined;
    title: string | undefined;
    artist: string | undefined;
    genres: string | undefined;
    lyrics: string | undefined;
};
export declare function Google(name: string, moreInfo?: boolean, language?: string): Promise<Data | null>;
export declare function Musixmatch(name: string): Promise<Data | null>;
export {};
