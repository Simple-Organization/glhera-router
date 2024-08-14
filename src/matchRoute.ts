export type RoutesMap = Record<string, Function>;

//
//

export function matchRoute(pathname: string, currentPathname: string) {
  return (
    currentPathname === pathname || currentPathname.startsWith(pathname + '/')
  );
}

//
//

export function getRoute(pathname: string, map: RoutesMap) {
  const keys = Object.keys(map);

  for (let i = 0; i < keys.length; i++) {
    if (matchRoute(keys[i], pathname)) {
      return map[keys[i]];
    }
  }

  return null;
}
