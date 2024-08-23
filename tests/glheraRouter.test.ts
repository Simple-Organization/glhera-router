import { test, expect } from '@playwright/test';
import { glheraRouter } from '../src';

//
//

test('Must create a router successfully with a url', () => {
  const router1 = glheraRouter({ url: 'http://localhost/glhera/' });

  // Expect the signal factory to be the same as the one we set.
  expect(router1.pathname.get()).toBe('/glhera/');
  expect(router1.query.get()).toEqual({});
  expect(router1.lastURL()).toBe('/glhera/');

  //

  const router2 = glheraRouter({});

  expect(router2.pathname.get()).toBe('/');
  expect(router2.query.get()).toEqual({});
  expect(router2.lastURL()).toBe('/');

  //

  const router3 = glheraRouter();

  expect(router3.pathname.get()).toBe('/');
  expect(router3.query.get()).toEqual({});
  expect(router3.lastURL()).toBe('/');
});

//
//

test('Must create a router successfully with a url with base', () => {
  const router = glheraRouter({
    url: 'http://localhost/glhera/',
    base: '/glhera',
  });

  // Expect the signal factory to be the same as the one we set.
  expect(router.pathname.get()).toBe('/');
  expect(router.query.get()).toEqual({});
  expect(router.lastURL()).toBe('/');
});

//
//

test('Must push a route correctly', () => {
  const router = glheraRouter({
    url: 'http://localhost/glhera/',
    base: '/glhera',
    testing: true,
  });

  // Expect the signal factory to be the same as the one we set.
  expect(router.pathname.get()).toBe('/');
  expect(router.query.get()).toEqual({});
  expect(router.lastURL()).toBe('/');

  router.push('/test');

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({});
  expect(router.lastURL()).toBe('/test');
});

//
//

test('Must push with query params', () => {
  const router = glheraRouter({
    url: 'http://localhost/glhera/',
    base: '/glhera',
    testing: true,
  });

  router.push('/test?id=1');

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({ id: '1' });
  expect(router.lastURL()).toBe('/test?id=1');

  router.push('/test', { id: '2' });

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({ id: '2' });
  expect(router.lastURL()).toBe('/test?id=2');
});

//
//

test('Must replace with and without query params', () => {
  const router = glheraRouter({ testing: true });

  router.replace('/testa');

  expect(router.pathname.get()).toBe('/testa');
  expect(router.query.get()).toEqual({});
  expect(router.lastURL()).toBe('/testa');

  router.replace('/test?id=1');

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({ id: '1' });
  expect(router.lastURL()).toBe('/test?id=1');

  router.replace('/test', { id: '2' });

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({ id: '2' });
  expect(router.lastURL()).toBe('/test?id=2');
});

//
//

test('Must popstate correctly', () => {
  const router = glheraRouter({ testing: true });

  router.setURL('/testa');

  expect(router.pathname.get()).toBe('/testa');
  expect(router.query.get()).toEqual({});
  expect(router.lastURL()).toBe('/testa');

  router.setURL('/test?id=1');

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({ id: '1' });
  expect(router.lastURL()).toBe('/test?id=1');

  router.setURL('http://localhost/test');

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({});
  expect(router.lastURL()).toBe('/test');
});

//
//

test('Must stringify objects, arrays correctly correctly', () => {
  const router = glheraRouter({ testing: true });

  router.push('/test', {
    a: [1, 2, 3],
    b: { c: 1, d: 2 },
    c: '1',
    d: 2,
    e: null,
    f: undefined,
    g: true,
  });

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({
    a: [1, 2, 3],
    b: { c: 1, d: 2 },
    c: '1',
    d: 2,
    e: null,
    f: undefined,
    g: true,
  });
  expect(router.lastURL()).toBe(
    '/test?a=%5B1%2C2%2C3%5D&b=%7B%22c%22%3A1%2C%22d%22%3A2%7D&c=1&d=2&g=true',
  );
});

//
//

test('The parser must change the query object correctly', () => {
  function parser(query: Record<string, string>) {
    return {
      id: query.id ? parseInt(query.id) : null,
    };
  }

  const router = glheraRouter({ testing: true, parser });

  router.setURL(
    '/test?a=%5B1%2C2%2C3%5D&b=%7B%22c%22%3A1%2C%22d%22%3A2%7D&c=1&d=2&g=true',
  );

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({ id: null });
  expect(router.lastURL()).toBe(
    '/test?a=%5B1%2C2%2C3%5D&b=%7B%22c%22%3A1%2C%22d%22%3A2%7D&c=1&d=2&g=true',
  );

  router.setURL('/test?id=1');

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({ id: 1 });
  expect(router.lastURL()).toBe('/test?id=1');

  //
  // Must work on push and replace

  router.push('/test1?id=1');

  expect(router.pathname.get()).toBe('/test1');
  expect(router.query.get()).toEqual({ id: 1 });
  expect(router.lastURL()).toBe('/test1?id=1');

  router.replace('/test2?id=1');

  expect(router.pathname.get()).toBe('/test2');
  expect(router.query.get()).toEqual({ id: 1 });
  expect(router.lastURL()).toBe('/test2?id=1');
});

//
//

test('Should not parse when send a queryObj in push', () => {
  function parser(query: Record<string, string>) {
    return {
      id: query.id ? parseInt(query.id) : null,
    };
  }

  const router = glheraRouter({ testing: true, parser });

  router.push('/test', {
    arroz: 1,
  } as any);

  expect(router.pathname.get()).toBe('/test');
  expect(router.query.get()).toEqual({ arroz: 1 });
  expect(router.lastURL()).toBe('/test?arroz=1');
});

//
//

test('Should give a wrong pathname if push is called with queryObj and query string in the URL', () => {
  const router = glheraRouter({ testing: true });

  router.push('/test?id=1', {
    arroz: 1,
  });

  expect(router.pathname.get()).toBe('/test?id=1');
  expect(router.query.get()).toEqual({ arroz: 1 });
  expect(router.lastURL()).toBe('/test?id=1?arroz=1');
});

//
//

test('When is using history, it should update the URL correctly', () => {
  const router = glheraRouter();

  const old = globalThis.history;

  let newUrl = '';

  globalThis.history = {
    pushState(data: any, unused: string, url: string) {
      newUrl = url;
    },
  } as any;

  router.push('/glhera/login/aaaaa?search=%5B"teste"%5D');

  expect(router.pathname.get()).toBe('/glhera/login/aaaaa');
  expect(router.query.get()).toEqual({ search: '["teste"]' });
  expect(router.lastURL()).toBe('/glhera/login/aaaaa?search=%5B%22teste%22%5D');

  expect(newUrl).toBe('/glhera/login/aaaaa?search=%5B%22teste%22%5D');

  globalThis.history = old;
});

//
//

test('When push a pathname that does not starts with / it must add', () => {
  const router = glheraRouter({ testing: true });

  router.push('', {
    arroz: 1,
  });

  expect(router.pathname.get()).toBe('/');
  expect(router.query.get()).toEqual({ arroz: 1 });
  expect(router.lastURL()).toBe('/?arroz=1');
});
