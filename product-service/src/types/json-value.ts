export type JsonValue =  boolean | number | string | null | Array<JsonValue> | JsonMap;
interface JsonMap {  [key: string]: JsonValue; }
