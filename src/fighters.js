export const ATTACKS = {
  jab: { name: 'JAB RÁPIDO', telegraph: .58, damage: 8, blockable: true, counterable: true, side: 1 },
  hookLeft: { name: 'GANCHO NA ESQUERDA', telegraph: .92, damage: 15, blockable: true, counterable: true, side: -1 },
  hookRight: { name: 'GANCHO NA DIREITA', telegraph: .92, damage: 15, blockable: true, counterable: true, side: 1 },
  uppercut: { name: 'UPPER IMPARÁVEL', telegraph: 1.12, damage: 23, blockable: false, counterable: true, side: 0 },
  flurry: { name: 'SEQUÊNCIA RELÂMPAGO', telegraph: .7, damage: 18, blockable: true, counterable: false, side: 0 },
};

export const FIGHTERS = [
  {
    id: 'lula', name: 'Lula', role: 'O VETERANO', perk: '+15 de vida e defesa reforçada',
    health: 115, power: .98, speed: .94, blockEfficiency: .85,
    specialName: 'UNIÃO NOS PUNHOS', skin: '#c99573', skinShadow: '#a66f52',
    hair: '#d4d0c3', hairLight: '#f0ede2', hairStyle: 'short', beard: 'full',
    trunks: '#a92f32', trunksLight: '#d84b48', gloves: '#c93e3a', shortsStripe: '#eee4cf', glasses: false,
  },
  {
    id: 'janones', name: 'Janones', role: 'O AGITADOR', perk: '+12% velocidade e esquiva longa',
    health: 100, power: .96, speed: 1.12, dodgeDuration: .48,
    specialName: 'RUA NOS PUNHOS', skin: '#9b684d', skinShadow: '#784a38',
    hair: '#211d1b', hairLight: '#3d332e', hairStyle: 'bald', beard: 'full',
    trunks: '#b73530', trunksLight: '#d95942', gloves: '#e1b83e', shortsStripe: '#e1b83e', glasses: false,
  },
  {
    id: 'jones', name: 'Jones Manoel', role: 'O ESTRATEGISTA', perk: '+18% poder nos contra-golpes',
    health: 100, power: 1.05, speed: 1, counterPower: 1.18,
    specialName: 'PUNHO DO POVO', skin: '#80523d', skinShadow: '#5f392c',
    hair: '#1e1b1a', hairLight: '#3a302c', hairStyle: 'short', beard: 'full',
    trunks: '#8e292e', trunksLight: '#b94143', gloves: '#c93e3a', shortsStripe: '#eee4cf', glasses: true,
  },
];

export const OPPONENTS = [
  {
    id: 'carlos', name: 'Carlos Bolsonaro', shortName: 'CARLOS', title: 'O GURU DO JAB', tactic: 'Jabs rápidos. Interrompa a preparação com um contra-golpe.',
    health: 72, power: .75, speed: 1.08, defense: .12, attacks: ['jab','jab','hookLeft'],
    skin: '#d0a07e', skinShadow: '#af7d60', hair: '#6c5a41', hairLight: '#8b7657', hairStyle: 'short', beard: 'full',
    trunks: '#272c35', trunksLight: '#3b424e', gloves: '#345f86', shortsStripe: '#d5b74f', glasses: true,
  },
  {
    id: 'flavio', name: 'Flávio Bolsonaro', shortName: 'FLÁVIO', title: 'O EXPLICADOR', tactic: 'Espera você atacar para bloquear. Acerte durante a recuperação.',
    health: 84, power: .85, speed: 1, defense: .28, attacks: ['jab','hookRight','hookLeft'],
    skin: '#dbad89', skinShadow: '#bd8b6d', hair: '#e6b94c', hairLight: '#f7d776', hairStyle: 'swoop', beard: 'none',
    trunks: '#1a2e4b', trunksLight: '#223b5d', gloves: '#345f86', shortsStripe: '#d5b74f', glasses: false,
  },
  {
    id: 'michelle', name: 'Michelle Bolsonaro', shortName: 'MICHELLE', title: 'A DISCRETA', tactic: 'Velocidade e mudanças de ritmo. Não se adiante aos sinais.',
    health: 88, power: .88, speed: 1.16, defense: .18, attacks: ['jab','flurry','hookRight'],
    skin: '#d9a783', skinShadow: '#bb8668', hair: '#4b3027', hairLight: '#704a3b', hairStyle: 'long', beard: 'none',
    trunks: '#6c2f46', trunksLight: '#8b425d', gloves: '#a93b60', shortsStripe: '#e4bd45', glasses: false,
  },
  {
    id: 'nicolas', name: 'Nicolas Ferreira', shortName: 'NICOLAS', title: 'O RELÂMPAGO', tactic: 'Sequências velozes e curtas. Defenda e responda com precisão.',
    health: 96, power: .95, speed: 1.25, defense: .16, attacks: ['jab','flurry','flurry','hookLeft'],
    skin: '#d6a17d', skinShadow: '#b98162', hair: '#c29a4a', hairLight: '#e1bd68', hairStyle: 'swoop', beard: 'none',
    trunks: '#24456b', trunksLight: '#32628b', gloves: '#e1b83e', shortsStripe: '#e1b83e', glasses: false,
  },
  {
    id: 'eduarda', name: 'Eduarda Campagnolo', shortName: 'EDUARDA', title: 'A INVESTIDA', tactic: 'Ganchos pesados. Use a esquiva para abrir espaço.',
    health: 105, power: 1.08, speed: 1.04, defense: .2, attacks: ['hookLeft','hookRight','uppercut'],
    skin: '#d9ad91', skinShadow: '#b98970', hair: '#d6b76c', hairLight: '#eed58f', hairStyle: 'long', beard: 'none',
    trunks: '#225858', trunksLight: '#327573', gloves: '#317e7b', shortsStripe: '#eee4cf', glasses: false,
  },
  {
    id: 'eduardo', name: 'Eduardo Bolsonaro', shortName: 'EDUARDO', title: 'O DIPLOMATA', tactic: 'Mistura uppers imparáveis com defesa alta. Observe o aviso vermelho.',
    health: 112, power: 1.12, speed: 1.05, defense: .3, attacks: ['jab','uppercut','hookRight','uppercut'],
    skin: '#d6a17d', skinShadow: '#b98162', hair: '#342b27', hairLight: '#55453c', hairStyle: 'short', beard: 'stubble',
    trunks: '#222c3c', trunksLight: '#334258', gloves: '#345f86', shortsStripe: '#eee4cf', glasses: false,
  },
  {
    id: 'pavanato', name: 'Pavanato', shortName: 'PAVANATO', title: 'O TANQUE', tactic: 'Lento, mas devastador. Não tente defender o upper.',
    health: 132, power: 1.32, speed: .86, defense: .24, broad: 1.15, attacks: ['hookLeft','hookRight','uppercut','uppercut'],
    skin: '#b98261', skinShadow: '#98664b', hair: '#29231f', hairLight: '#463c34', hairStyle: 'bald', beard: 'full',
    trunks: '#1d3030', trunksLight: '#2b4944', gloves: '#d1aa3b', shortsStripe: '#d5b74f', glasses: false,
  },
  {
    id: 'jair', name: 'Jair Bolsonaro', shortName: 'JAIR', title: 'O CAMPEÃO', tactic: 'Todos os golpes, pouca abertura. Guarde o especial para o final.',
    health: 145, power: 1.25, speed: 1.13, defense: .32, attacks: ['jab','hookLeft','hookRight','flurry','uppercut'],
    skin: '#d2a07d', skinShadow: '#b58163', hair: '#655f55', hairLight: '#8b8578', hairStyle: 'short', beard: 'none',
    trunks: '#263d32', trunksLight: '#365747', gloves: '#e1b83e', shortsStripe: '#e1b83e', glasses: false,
  },
];

export const DEFAULT_FIGHTER = FIGHTERS[0];
