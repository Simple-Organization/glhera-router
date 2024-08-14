import { test, expect } from '@playwright/test';
import { glheraRouter } from '../src';
import { setSignalFactory } from 'signal-factory';
import { signal } from 'signal-factory/vanilla';

//
//

setSignalFactory(signal);

//
//

test('Must create a router successfully with a url', () => {
  const router = glheraRouter('http://localhost/glhera/');

  // Expect the signal factory to be the same as the one we set.
  expect(router.base).toBe('');
  expect(router.pathname.value).toBe('/glhera/');
  expect(router.query.value).toEqual({});
  expect(router.lastURL).toBe('/glhera/');
});

//
//

test('Must create a router successfully with a url with base', () => {
  const router = glheraRouter('http://localhost/glhera/', '/glhera');

  // Expect the signal factory to be the same as the one we set.
  expect(router.base).toBe('/glhera');
  expect(router.pathname.value).toBe('/');
  expect(router.query.value).toEqual({});
  expect(router.lastURL).toBe('/');
});

//
//

test('Must push a route correctly', () => {
  const router = glheraRouter('http://localhost/glhera/', '/glhera', true);

  // Expect the signal factory to be the same as the one we set.
  expect(router.base).toBe('/glhera');
  expect(router.pathname.value).toBe('/');
  expect(router.query.value).toEqual({});
  expect(router.lastURL).toBe('/');

  router.push('/test');

  expect(router.pathname.value).toBe('/test');
  expect(router.query.value).toEqual({});
  expect(router.lastURL).toBe('/test');
});

//
//

test('Must push with query params', () => {
  const router = glheraRouter('http://localhost/glhera/', '/glhera', true);

  router.push('/test?id=1');

  expect(router.pathname.value).toBe('/test');
  expect(router.query.value).toEqual({ id: '1' });
  expect(router.lastURL).toBe('/test?id=1');

  router.push('/test', { id: '2' });

  expect(router.pathname.value).toBe('/test');
  expect(router.query.value).toEqual({ id: '2' });
  expect(router.lastURL).toBe('/test?id=2');
});

//
//

test('Must replace with and without query params', () => {
  const router = glheraRouter('/', '', true);

  router.replace('/testa');

  expect(router.pathname.value).toBe('/testa');
  expect(router.query.value).toEqual({});
  expect(router.lastURL).toBe('/testa');

  router.replace('/test?id=1');

  expect(router.pathname.value).toBe('/test');
  expect(router.query.value).toEqual({ id: '1' });
  expect(router.lastURL).toBe('/test?id=1');

  router.replace('/test', { id: '2' });

  expect(router.pathname.value).toBe('/test');
  expect(router.query.value).toEqual({ id: '2' });
  expect(router.lastURL).toBe('/test?id=2');
});

//
//

test('Must popstate correctly', () => {
  const router = glheraRouter('/', '', true);

  router.setURL('/testa');

  expect(router.pathname.value).toBe('/testa');
  expect(router.query.value).toEqual({});
  expect(router.lastURL).toBe('/testa');

  router.setURL('/test?id=1');

  expect(router.pathname.value).toBe('/test');
  expect(router.query.value).toEqual({ id: '1' });
  expect(router.lastURL).toBe('/test?id=1');

  router.replace('http://localhost/test');

  expect(router.pathname.value).toBe('/test');
  expect(router.query.value).toEqual({});
  expect(router.lastURL).toBe('/test');
});
