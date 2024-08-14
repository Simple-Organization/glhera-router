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
