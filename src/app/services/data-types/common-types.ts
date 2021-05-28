export type Banner={
    targetId: number;
    imageUrl: string;
    url: string;
}

export type HotTag = {
    id: number;
    name: string;
    position: number;
}

// 歌单
export type SongSheet = {
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
    tracks: Song[];  //歌曲组成的数组
}

// 歌手
export type Singer = {
    id: number;
    name: string;
    picUrl: string;
    albumSize: number;
}

// 歌曲  
export type Song = {
    id: number;
    name: string;
    url: string;
    ar: Singer[]; // 歌曲数组
    al: {
        id: string;
        name: string;
        picUrl: string;
    };
    dt: number; //播放时间
}

// 播放地址
export type SongUrl = {
    id: number;
    url: string;
}
