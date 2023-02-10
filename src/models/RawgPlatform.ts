
export interface Game {
    id: number;
    slug: string;
    name: string;
    added: number;
}

export interface Platform {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
    image?: any;
    year_start?: number;
    year_end?: any;
    games: Game[];
}

export interface RawgPlatform {
    count: number;
    next: string;
    previous?: any;
    results: Platform[];
}


