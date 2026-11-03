export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (from, to, amount) => from + (to - from) * amount;

export function createRng(seed = 13) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

export function resolveIncomingDamage(baseDamage, { dodging = false, blocking = false, blockable = true, stamina = 100 } = {}) {
  if (dodging) return { damage: 0, avoided: true, blocked: false, staminaCost: 0 };
  if (blocking && blockable && stamina >= 8) {
    return { damage: Math.max(1, Math.round(baseDamage * .18)), avoided: false, blocked: true, staminaCost: 22 };
  }
  return { damage: Math.round(baseDamage), avoided: false, blocked: false, staminaCost: 0 };
}

export function resolvePlayerPunch({ power = 1, cross = false, counter = false, vulnerable = false, guarded = false } = {}) {
  if (guarded && !counter && !vulnerable) return { damage: 0, meter: 0, blocked: true };
  const base = cross ? 13 : 8;
  const multiplier = counter ? 1.65 : vulnerable ? 1.25 : 1;
  return {
    damage: Math.round(base * power * multiplier),
    meter: counter ? 32 : vulnerable ? 20 : 12,
    blocked: false,
  };
}

export function decisionWinner(playerHealth, enemyHealth) {
  if (playerHealth === enemyHealth) return 'draw';
  return playerHealth > enemyHealth ? 'player' : 'enemy';
}
