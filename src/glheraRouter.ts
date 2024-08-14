import { Signal, signalFactory } from 'signal-factory';

//
//

export interface GLHeraRouter {
  pathname: Signal<string>;
  query: Signal<Record<string, string>>;

  /** base route for router, like /glhera */
  base: string;
  /** Getter with the last url that was loaded without the base */
  lastURL: string;

  /**
   * Push a route based on url sent, will update the history api
   *
   * If the URL is the same will not update history api, but will update the queryObj signal anyway
   */
  push(url: string): void;
  /**
   * Push a route based on pathname and queryObj sent, will update the history api
   *
   * If the URL is the same will not update history api, but will update the queryObj signal anyway
   */
  push(pathname: string, queryObj: Record<string, any>): void;

  /**
   * Replace a route based on url sent, will update the history api
   *
   * If the URL is the same will not update history api, but will update the queryObj signal anyway
   */
  replace(url: string): void;
  /**
   * Replace a route based on pathname and queryObj sent, will update the history api
   *
   * If the URL is the same will not update history api, but will update the queryObj signal anyway
   */
  replace(pathname: string, queryObj: Record<string, any>): void;

  /**
   * Change the router state from a url string, does not update the history api
   *
   * The url needs to have http:// and origin to create a new URL object
   */
  setURL(url: string): void;

  /**
   * Method to subscribe to window.addEventListener('popstate', ...);
   */
  subWinPopState(): () => void;
}

//
//

/**
 * Create a router object that can be used to manage the state of the router
 * @param url URL to create the router from
 * @param base base route for router, like /glhera
 * @param testing if true will not access the browser history api
 */
export function glheraRouter(
  url: string,
  base = '',
  testing = false,
): GLHeraRouter {
  //
  // Set the pathname and queryObj from the URL

  if (url.startsWith('/')) {
    url = 'http://localhost' + url;
  }

  const _url = new URL(url);
  const queryObj = Object.fromEntries(_url.searchParams.entries());

  //
  //

  if (_url.pathname.startsWith(base)) {
    _url.pathname = _url.pathname.slice(base.length);
  }

  //
  //

  const pathSignal = signalFactory<string>(_url.pathname);
  const querySignal = signalFactory<Record<string, string>>(queryObj);
  let lastURL = _url.pathname + _url.search;

  //
  //

  function setURL(url: string): void {
    //
    // Set the router's URL and query parameters

    if (url.startsWith('/')) {
      url = 'http://localhost' + url;
    }

    const _url = new URL(url);

    const _query = {} as Record<string, string>;

    for (const [key, value] of _url.searchParams.entries()) {
      _query[key] = value;
    }

    if (_url.pathname.startsWith(base)) {
      _url.pathname = _url.pathname.slice(base.length);
    }

    let newURL = _url.pathname;
    const queryStr = _url.searchParams.toString();

    if (queryStr) {
      newURL += '?' + queryStr;
    }

    pathSignal.value = _url.pathname;
    querySignal.value = _query;
    lastURL = newURL;
  }

  //
  //

  /**
   * Internal method used by pushRoute and replaceRoute
   */
  function _updateURLSignal(
    pathname: string,
    queryObj: Record<string, string> | undefined,
    historyMethod: 'pushState' | 'replaceState',
  ): void {
    if (!queryObj) {
      let strUrl = pathname;
      if (strUrl.startsWith('/')) {
        strUrl = 'http://localhost' + strUrl;
      }

      const _url = new URL(strUrl);
      queryObj = Object.fromEntries(_url.searchParams.entries());
      pathname = _url.pathname;
    }

    pathSignal.value = pathname;
    querySignal.value = queryObj;

    let newURL = pathname;
    const queryStr = new URLSearchParams(queryObj).toString();

    if (queryStr) {
      newURL += '?' + queryStr;
    }

    if (lastURL === newURL) {
      return;
    }

    lastURL = newURL;

    //
    // Only access browser api like history if not in testing
    if (!testing) {
      history[historyMethod](null, '', base + pathname);
    }
  }

  //
  //

  function replace(pathname: string, queryObj?: Record<string, any>): void {
    _updateURLSignal(pathname, queryObj, 'replaceState');
  }

  function push(pathname: string, queryObj?: Record<string, any>): void {
    _updateURLSignal(pathname, queryObj, 'pushState');
  }

  //
  //

  function subWinPopState(): () => void {
    const updateURL = () => {
      setURL(window.location.href);
    };

    window.addEventListener('popstate', updateURL);
    return () => window.removeEventListener('popstate', updateURL);
  }

  //
  //

  return {
    pathname: pathSignal,
    query: querySignal,
    push,
    replace,
    setURL,
    subWinPopState,
    base,
    get lastURL() {
      return lastURL;
    },
  };
}
