export class Audit {
    create: Operation;
    modify: Operation;
}

export class Operation {
    operator: Opeartor;
    at: Date;
}

export class Opeartor {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export enum CRUD {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

export type FilterQuery<T> = {
    [P in keyof T]?: T[P] | {
        $eq?: T[P];
        $gt?: T[P];
        $gte?: T[P];
        $in?: T[P][];
        $lt?: T[P];
        $lte?: T[P];
        $ne?: T[P];
        $nin?: T[P][];
        $and?: (FilterQuery<T[P]> | T[P])[];
        $or?: (FilterQuery<T[P]> | T[P])[];
        $not?: (FilterQuery<T[P]> | T[P])[] | T[P];
        $expr?: any;
        $jsonSchema?: any;
        $mod?: [number, number];
        $regex?: RegExp;
        $options?: string;
        $text?: {
            $search: string;
            $language?: string;
            $caseSensitive?: boolean;
            $diacraticSensitive?: boolean;
        };
        $where: Object;
        $geoIntersects?: Object;
        $geoWithin?: Object;
        $near?: Object;
        $nearSphere?: Object;
        $elemMatch?: Object;
        $size?: number;
        $bitsAllClear?: Object;
        $bitsAllSet?: Object;
        $bitsAnyClear?: Object;
        $bitsAnySet?: Object;
        [key: string]: any;
    };
} | { [key: string]: any };

export class AppBarConfig {
    isShowSearch: boolean;
    searchAction: () => void;
}

export enum ViewMode {
    KANBAN = 'KANBAN',
    GANTT = 'GANTT'
}

export enum PopOverTarget {
    NEW_TASK = 'NEW_TASK',
    STATUS_NAME = 'STATUS_NAME'
}

export enum GanttHeader {
    NAME = 1,
    EXPECTED_START_DATE = 2,
    EXPECTED_END_DATE = 3,
    ACTUAL_START_DATE =  4,
    ACTUAL_END_DATE = 5,
    STATUS = 6,
    PROGRESS = 7,
    ASSIGNEE = 8,
}

export enum LANGUAGE {
    ja_JP = 'ja_JP',
    en_US = 'en_US',
}