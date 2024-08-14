import { Signal, signalFactory } from 'signal-factory';

//
//

export interface GLHeraRouter {
  pathname: Signal<string>;
  query: Signal<Record<string, string>>;

  /** base route for router, like /glhera */
  base: string;

  /** Not a signal, is used to avoid pushing the same URL */
  lastURL: string;
}

//
//

export function glheraRouter(url: string, base = ''): GLHeraRouter {
  //
  // Set the pathname and queryObj from the URL

  let _url: URL;
  let queryObj: Record<string, any>;

  if (url.startsWith('/')) {
    url = 'http://localhost' + url;
  }

  _url = new URL(url);

  queryObj = Object.fromEntries(_url.searchParams.entries());

  //
  //

  if (_url.pathname.startsWith(base)) {
    _url.pathname = _url.pathname.slice(base.length);
  }

  //
  //

  return {
    pathname: signalFactory(_url.pathname),
    query: signalFactory(queryObj),
    lastURL: _url.pathname + _url.search,
    base,
  };
}
