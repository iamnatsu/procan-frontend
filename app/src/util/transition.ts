
export type Query<T extends string = string> = Record<T, string | Array<string> | undefined>;

export function transitionToLoginPage() {
    return transitionTo('/login');
}
  
export function transitionTo(path: string, query?: Query) {
  const arr = window.location.href.split("/");
  const result = arr[0] + "//" + arr[2] + '/#'
  location.href = result + path;
}