import test from 'ava';

import { ParsedCard } from '../types';

import { getCard, getCardsBatch } from './scryfall';

const testCases: Map<string, string> = new Map();
testCases.set('Black Lotus', 'Black Lotus');
testCases.set('bLAc lOTus', 'Black Lotus');
testCases.set('leb/233', 'Black Lotus');
testCases.set('Tour de commande', 'Tour de commandement');
testCases.set('m3c/331/', 'Command Tower');
testCases.set('m3c/331/de', 'Befehlsturm');
testCases.set('56ebc372-aabd-4174-a943-c7bf59e5028d', 'Phantom Nishoba');

testCases.forEach((expected, input) => {
  test(`getCard ${input}`, (t) => {
    const card: ParsedCard = {
      customFlags: new Map(),
      language: undefined,
      name: input,
      quantity: 0,
    };

    return getCard(card).then((res) =>
      t.is(res.printed_name || res.name, expected)
    );
  });
});

test('language override', (t) => {
  const card: ParsedCard = {
    customFlags: new Map(),
    language: 'fr',
    name: 'm3c/331/de',
    quantity: 0,
  };

  return getCard(card).then((res) =>
    t.is(res.printed_name, 'Tour de commandement')
  );
});

test('batch fetch', (t) => {
  const cards: ParsedCard[] = [
    {
      customFlags: new Map(),
      language: 'fr',
      name: 'm3c/331/de',
      quantity: 0,
    },
    {
      customFlags: new Map(),
      language: undefined,
      name: 'Black Lotus',
      quantity: 0,
    },
  ];
  const expectedNames = ['Tour de commandement', 'Black Lotus'];
  return getCardsBatch(cards).then((res) => {
    const fetchedNames = res.map(card => card.printed_name || card.name);
    return t.deepEqual(fetchedNames, expectedNames);
  });
});
