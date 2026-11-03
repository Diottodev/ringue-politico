import test from 'node:test';
import assert from 'node:assert/strict';
import { decisionWinner, formatTime, resolveIncomingDamage, resolvePlayerPunch } from '../src/logic.js';
import { FIGHTERS, OPPONENTS } from '../src/fighters.js';

test('esquiva evita dano e defesa reduz apenas golpes defendíveis', () => {
  assert.deepEqual(resolveIncomingDamage(20, { dodging: true }), { damage: 0, avoided: true, blocked: false, staminaCost: 0 });
  assert.equal(resolveIncomingDamage(20, { blocking: true, blockable: true }).damage, 4);
  assert.equal(resolveIncomingDamage(20, { blocking: true, blockable: false }).damage, 20);
});

test('contra-golpe e vulnerabilidade aumentam dano e barra especial', () => {
  const normal = resolvePlayerPunch();
  const counter = resolvePlayerPunch({ counter: true });
  assert.ok(counter.damage > normal.damage);
  assert.ok(counter.meter > normal.meter);
  assert.equal(resolvePlayerPunch({ guarded: true }).blocked, true);
  assert.equal(resolvePlayerPunch({ guarded: true, counter: true }).blocked, false);
});

test('decisão por pontos e relógio funcionam', () => {
  assert.equal(decisionWinner(50, 40), 'player');
  assert.equal(decisionWinner(20, 40), 'enemy');
  assert.equal(decisionWinner(40, 40), 'draw');
  assert.equal(formatTime(75), '01:15');
});

test('elenco jogável e circuito têm todos os personagens pedidos', () => {
  assert.deepEqual(FIGHTERS.map((fighter) => fighter.id), ['lula', 'janones', 'jones']);
  for (const id of ['carlos', 'flavio', 'michelle', 'nicolas', 'eduarda', 'eduardo', 'pavanato', 'jair']) {
    assert.ok(OPPONENTS.some((opponent) => opponent.id === id));
  }
  assert.equal(OPPONENTS.length, 8);
});
