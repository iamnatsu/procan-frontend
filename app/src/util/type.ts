export type Nullable<T> = T | null;

type JSONObject = { [key: string]: any };
export type ValueOf<T extends JSONObject = {}> = T[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// HACK 以下の通り使うと、Function型の返り値のtypeを取得できる。なお、Typescript2.8では、コレを使わずに取得可能である。
///
/// const returns = getReturnType(() => 'hoge');
/// type TestReturns = typeof returns // string
///
export function getReturnType<RT>(expression: (...params: any[]) => RT): RT {
  return undefined as any as RT;
}