import { Observable } from "rxjs"

export type wySliderType = {
    left?: string | null;
    width?: string | null;
    height?: string | null;
    bottem?: string | null;
}

export type SliderEventObserverConfig = {
    start: string;
    move: string;
    end: string;
    filterEvent: (e: Event) => boolean; //函数返回值是布尔类型
    plunkKey: string[];
    startPlucked$?: Observable<number>;
    moveResolved$?: Observable<number>;
    end$?: Observable<Event>;
}