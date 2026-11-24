import { Game } from './game.js';
import { SoundSystem } from './audio.js';
import { FIGHTERS, OPPONENTS, DEFAULT_FIGHTER } from './fighters.js';
import { clamp, formatTime } from './logic.js';
import { drawBoxer } from './art.js';

const $=(selector)=>document.querySelector(selector);const $$=(selector)=>[...document.querySelectorAll(selector)];
const canvas=$('#game'),sound=new SoundSystem(),coarse=matchMedia('(pointer:coarse)').matches;
const screens={menu:$('#menu-screen'),fighter:$('#fighter-screen'),circuit:$('#circuit-screen'),how:$('#how-screen'),pause:$('#pause-screen'),result:$('#result-screen')};
const fightUi=[$('#fight-hud'),$('#special-hud'),$('#keyboard-help'),$('#pause-button')];
let selectedFighter=DEFAULT_FIGHTER,unlocked=0,toastTimer,announceTimer;
try{unlocked=clamp(Number(localStorage.getItem('ringue-zero.unlocked')||0),0,OPPONENTS.length-1);sound.muted=localStorage.getItem('ringue-zero.muted')==='true'}catch{/* armazenamento indisponível */}

function hideScreens(){Object.values(screens).forEach((screen)=>screen.classList.add('hidden'))}
function showFightUi(show){fightUi.forEach((element)=>element.classList.toggle('hidden',!show));$('#touch-controls').classList.toggle('hidden',!show||!coarse)}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),1700)}
function announce(message,color='gold'){clearTimeout(announceTimer);const el=$('#announcement');el.textContent=message;el.className=color;announceTimer=setTimeout(()=>{el.textContent=''},message==='NOCAUTE!'?2100:750)}
function updateProgressNote(){$('#progress-note').textContent=`CIRCUITO ZERO · ${unlocked+1} / ${OPPONENTS.length} LIBERADOS`}
function portrait(canvas,fighter,scale){drawBoxer(canvas.getContext('2d'),fighter,{state:'idle'},canvas.width/2,canvas.height-5,scale,0)}

const game=new Game(canvas,sound,{
  onUpdate(data){
    $('#player-health').style.width=`${data.playerHealth*100}%`;$('#enemy-health').style.width=`${data.enemyHealth*100}%`;
    $('#stamina-fill').style.width=`${data.stamina}%`;$('#special-fill').style.width=`${data.special}%`;
    $('#special-hud').classList.toggle('ready',data.special>=100);$('#special-hint').textContent=data.special>=100?'ESPAÇO PARA FINALIZAR':'ACERTE E DESVIE PARA CARREGAR';
    $('#fight-timer').textContent=formatTime(data.timeLeft);$('#fight-timer').classList.toggle('danger',data.timeLeft<=15);
    $('#player-name').textContent=data.fighter.name.toUpperCase();$('#enemy-name').textContent=data.opponent.shortName;
    $('#enemy-title').textContent=data.opponent.title;$('#special-name').textContent=data.fighter.specialName;
  },
  onToast:toast,onAnnounce:announce,onStart:()=>showFightUi(true),
  onPause(paused){screens.pause.classList.toggle('hidden',!paused);$('#touch-controls').classList.toggle('hidden',paused||!coarse);resetInput()},
  onEnd(result){
    showFightUi(false);hideScreens();screens.result.classList.remove('hidden');
    $('#result-score').textContent=String(result.score).padStart(6,'0');$('#result-health').textContent=`${Math.round(result.health*100)}%`;$('#result-combo').textContent=result.combo;
    if(result.won){
      unlocked=Math.max(unlocked,Math.min(OPPONENTS.length-1,result.opponentIndex+1));
       try{localStorage.setItem('ringue-zero.unlocked',String(unlocked))}catch{/* sem persistência */}
      $('#result-eyebrow').textContent=result.reason==='ko'?'VITÓRIA POR NOCAUTE':'VITÓRIA POR DECISÃO';
       $('#result-title').textContent=result.last?'Campeão da Arena Zero!':'Vitória no ringue.';
       $('#result-message').textContent=result.last?'Você venceu os oito desafios e conquistou o circuito.':'O cinturão está mais perto. O próximo adversário já aquece os punhos.';
    }else{
      $('#result-eyebrow').textContent=result.reason==='draw'?'EMPATE NOS PONTOS':'DERROTA NO RINGUE';
      $('#result-title').textContent=result.reason==='decision'?'Decisão contestada.':'Guarda baixa, campeão.';
      $('#result-message').textContent=result.reason==='decision'?'O adversário levou nos pontos. Observe os sinais e tente a revanche.':'O juiz encerrou a contagem. Respire, ajuste o timing e volte mais forte.';
    }
    $('#next-button').classList.toggle('hidden',!result.won||result.last);updateProgressNote();buildOpponentCards();
  },
});

function buildFighterCards(){
  const grid=$('#fighter-grid');
  for(const fighter of FIGHTERS){
    const card=document.createElement('button');card.type='button';card.className='fighter-card';card.dataset.fighter=fighter.id;card.setAttribute('role','radio');
    const art=document.createElement('canvas');art.width=200;art.height=220;portrait(art,fighter,.82);
    const name=document.createElement('strong');name.textContent=fighter.name;
    const role=document.createElement('span');role.className='fighter-role';role.textContent=fighter.role;
    const perk=document.createElement('span');perk.className='fighter-perk';perk.textContent=fighter.perk;
    const stats=document.createElement('span');stats.className='fighter-stats';stats.textContent=`VIDA ${fighter.health} · PODER ${Math.round(fighter.power*100)} · RITMO ${Math.round(fighter.speed*100)}`;
    card.append(art,name,role,perk,stats);card.addEventListener('click',()=>{selectedFighter=fighter;updateFighterSelection();sound.sfx('click')});grid.append(card);
  }
  updateFighterSelection();
}
function updateFighterSelection(){$$('.fighter-card').forEach((card)=>{const selected=card.dataset.fighter===selectedFighter.id;card.classList.toggle('selected',selected);card.setAttribute('aria-checked',String(selected))});$('#selected-fighter-perk').textContent=`${selectedFighter.name} · ${selectedFighter.perk}`.toUpperCase()}
function buildOpponentCards(){
  const grid=$('#opponent-grid');grid.replaceChildren();
  OPPONENTS.forEach((opponent,index)=>{
    const locked=index>unlocked,card=document.createElement('button');card.type='button';card.className=`opponent-card${locked?' locked':''}${index===unlocked?' current':''}`;card.disabled=locked;card.setAttribute('role','listitem');
    const art=document.createElement('canvas');art.width=140;art.height=130;portrait(art,opponent,.48);
    const copy=document.createElement('span'),name=document.createElement('strong'),title=document.createElement('span'),number=document.createElement('span');
    name.textContent=opponent.name;title.className='opponent-title';title.textContent=opponent.title;number.className='opponent-number';number.textContent=String(index+1).padStart(2,'0');copy.append(name,title);card.append(art,copy,number);
    card.addEventListener('mouseenter',()=>{$('#opponent-tactic').textContent=`${opponent.shortName}: ${opponent.tactic}`});
    card.addEventListener('focus',()=>{$('#opponent-tactic').textContent=`${opponent.shortName}: ${opponent.tactic}`});
    card.addEventListener('click',()=>startFight(index));grid.append(card);
  });
  $('#circuit-fighter').textContent=`DESAFIANTE · ${selectedFighter.name.toUpperCase()}`;
}
function openFighterSelection(){sound.sfx('click');hideScreens();showFightUi(false);game.state='selection';screens.fighter.classList.remove('hidden');updateFighterSelection()}
function openCircuit(){sound.stopMusic();hideScreens();showFightUi(false);game.state='circuit';buildOpponentCards();screens.circuit.classList.remove('hidden');resetInput()}
function startFight(index){
  sound.sfx('click');hideScreens();showFightUi(true);resetInput();game.start(selectedFighter,index);
}

$('#start-button').addEventListener('click',openFighterSelection);$('#how-start-button').addEventListener('click',openFighterSelection);
$('#confirm-fighter-button').addEventListener('click',openCircuit);$('#fighter-back-button').addEventListener('click',()=>{sound.sfx('click');hideScreens();game.state='menu';screens.menu.classList.remove('hidden')});
$('#circuit-back-button').addEventListener('click',openFighterSelection);
$('#how-button').addEventListener('click',()=>{sound.sfx('click');hideScreens();screens.how.classList.remove('hidden')});
$('#how-back-button').addEventListener('click',()=>{sound.sfx('click');hideScreens();screens.menu.classList.remove('hidden')});
$('#resume-button').addEventListener('click',()=>game.togglePause());$('#pause-button').addEventListener('click',()=>game.togglePause());
$('#restart-button').addEventListener('click',()=>startFight(game.opponentIndex));$('#rematch-button').addEventListener('click',()=>startFight(game.opponentIndex));
$('#next-button').addEventListener('click',()=>startFight(Math.min(OPPONENTS.length-1,game.opponentIndex+1)));
$('#pause-circuit-button').addEventListener('click',openCircuit);$('#result-circuit-button').addEventListener('click',openCircuit);

function updateSoundButton(){$('#sound-button').textContent=sound.muted?'MUDO':'SOM';$('#sound-button').setAttribute('aria-label',sound.muted?'Ativar som':'Desativar som')}
function toggleSound(){sound.setMuted(!sound.muted);try{localStorage.setItem('ringue-zero.muted',String(sound.muted))}catch{/* sem persistência */}updateSoundButton();if(!sound.muted)sound.sfx('click')}
$('#sound-button').addEventListener('click',toggleSound);updateSoundButton();

function resetInput(){game.setBlock(false)}
window.addEventListener('keydown',(event)=>{
  const key=event.key.toLowerCase();if(['arrowleft','arrowright','arrowdown',' ','a','d','s','j','k'].includes(key))event.preventDefault();
  if(key==='m'&&!event.repeat){toggleSound();return}if((key==='escape'||key==='p')&&!event.repeat){game.togglePause();return}
  if(event.repeat&&!['s','arrowdown'].includes(key))return;
  if(key==='a'||key==='arrowleft')game.dodge(-1);if(key==='d'||key==='arrowright')game.dodge(1);
  if(key==='s'||key==='arrowdown')game.setBlock(true);if(key==='j')game.punch(false);if(key==='k')game.punch(true);if(key===' ')game.useSpecial();
});
window.addEventListener('keyup',(event)=>{const key=event.key.toLowerCase();if(key==='s'||key==='arrowdown')game.setBlock(false)});
window.addEventListener('blur',resetInput);document.addEventListener('visibilitychange',()=>{if(document.hidden&&['playing','intro'].includes(game.state))game.togglePause()});
$$('[data-action]').forEach((button)=>{
  const action=button.dataset.action;
  button.addEventListener('pointerdown',(event)=>{event.preventDefault();if(action==='left')game.dodge(-1);if(action==='right')game.dodge(1);if(action==='block')game.setBlock(true);if(action==='jab')game.punch(false);if(action==='cross')game.punch(true);if(action==='special')game.useSpecial()});
  if(action==='block'){for(const type of ['pointerup','pointercancel','pointerleave'])button.addEventListener(type,()=>game.setBlock(false))}
});

buildFighterCards();buildOpponentCards();updateProgressNote();
portrait($('#poster-player'),FIGHTERS[0],.75);portrait($('#poster-enemy'),OPPONENTS.at(-1),.75);
let previous=performance.now();function frame(now){const dt=Math.min(.05,(now-previous)/1000);previous=now;game.update(dt);game.render();requestAnimationFrame(frame)}requestAnimationFrame(frame);
