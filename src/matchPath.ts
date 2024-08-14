export type RoutesMap = Record<string, Function>;

//
//

export function isPathMatch(pathname: string, currentPathname: string) {
  return (
    currentPathname === pathname || currentPathname.startsWith(pathname + '/')
  );
}

//
//

export function matchPath(pathname: string, map: RoutesMap) {
  const keys = Object.keys(map);

  for (let i = 0; i < keys.length; i++) {
    if (isPathMatch(keys[i], pathname)) {
      return map[keys[i]];
    }
  }

  return null;
}
