type Data = {
    songwriters: string | undefined;
    title: string | undefined;
    artist: string | undefined;
    genres: string | undefined;
    sources: string[];
    lyrics: string | undefined;
};
export declare function Google(name: string, language?: string): Promise<Data>;
export declare function Musixmatch(name: string): Promise<Data>;
export {};
