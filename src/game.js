import { ATTACKS, DEFAULT_FIGHTER, FIGHTERS, OPPONENTS } from './fighters.js';
import { clamp, createRng, decisionWinner, lerp, resolveIncomingDamage, resolvePlayerPunch } from './logic.js';
import { createArena, drawArenaForeground, drawArenaLights, drawBoxer, drawImpact, drawPlayerBack } from './art.js';

export class Game {
  constructor(canvas,sound,hooks={}){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.sound=sound;this.hooks=hooks;
    this.background=createArena();this.time=0;this.state='menu';this.fighter=DEFAULT_FIGHTER;this.opponent=OPPONENTS.at(-1);
    this.enemyPose={state:'idle',enemy:true};this.playerPose={state:'idle'};this.impact=null;this.shake=0;
  }

  start(fighter=DEFAULT_FIGHTER,opponentIndex=0){
    this.fighter=fighter;this.opponentIndex=clamp(opponentIndex,0,OPPONENTS.length-1);this.opponent=OPPONENTS[this.opponentIndex];
    this.rng=createRng(13013+this.opponentIndex*91);this.playerHealth=fighter.health;this.enemyHealth=this.opponent.health;
    this.stamina=100;this.special=0;this.score=0;this.combo=0;this.bestCombo=0;this.timeLeft=75;
    this.playerPose={state:'idle',actionTimer:0,direction:0};this.enemyPose={state:'idle',timer:1.2,enemy:true,attack:'jab'};
    this.blockHeld=false;this.punchCooldown=0;this.dodgeCooldown=0;this.impact=null;this.shake=0;
    this.state='intro';this.introTimer=3.25;this.introStage=-1;this.stateBeforePause='playing';
    this.sound.startMusic();this.hooks.onStart?.();this.updateHud();
  }

  update(dt){
    this.time+=dt;this.shake=Math.max(0,this.shake-dt*38);
    if(this.impact){this.impact.life-=dt;if(this.impact.life<=0)this.impact=null}
    if(['menu','selection','circuit','paused','ended'].includes(this.state))return;
    if(this.state==='intro'){this.updateIntro(dt);return}
    if(this.state==='ko'){
      this.koTimer-=dt;if(this.koTimer<=0)this.completeResult();return;
    }
    if(this.state!=='playing')return;

    this.timeLeft-=dt;
    if(this.timeLeft<=0){this.timeLeft=0;this.decision();return}
    this.punchCooldown=Math.max(0,this.punchCooldown-dt);this.dodgeCooldown=Math.max(0,this.dodgeCooldown-dt);
    this.stamina=clamp(this.stamina+dt*(this.blockHeld?8:23),0,100);
    if(this.playerPose.actionTimer>0){
      this.playerPose.actionTimer-=dt;
      if(this.playerPose.actionTimer<=0){this.playerPose.state=this.blockHeld?'block':'idle';this.playerPose.direction=0}
    }else if(this.blockHeld&&this.playerPose.state==='idle')this.playerPose.state='block';
    this.updateEnemy(dt);this.updateHud();
  }

  updateIntro(dt){
    this.introTimer-=dt;
    const stage=this.introTimer>2.25?0:this.introTimer>1.25?1:this.introTimer>.45?2:3;
    if(stage!==this.introStage){
      this.introStage=stage;
      const announcements=[['ROUND 1','gold'],[this.opponent.shortName,'red'],['GUARDA ALTA','gold'],['LUTEM!','gold']];
      this.hooks.onAnnounce?.(announcements[stage][0],announcements[stage][1]);
      if(stage===3){this.sound.sfx('bell');this.state='playing'}
    }
  }

  updateEnemy(dt){
    const enemy=this.enemyPose;
    if(enemy.timer>0)enemy.timer-=dt;
    if(enemy.timer>0)return;
    if(enemy.state==='idle'){this.beginTelegraph();return}
    if(enemy.state==='telegraph'){this.executeAttack();return}
    if(enemy.state==='attack'){
      enemy.state='recover';enemy.timer=(enemy.avoided?.95:.58)/this.opponent.speed;return;
    }
    if(['recover','stunned','hit','block'].includes(enemy.state)){
      enemy.state='idle';enemy.timer=(.55+this.rng()*.65)/this.opponent.speed;
    }
  }

  beginTelegraph(){
    const key=this.opponent.attacks[Math.floor(this.rng()*this.opponent.attacks.length)];
    this.enemyPose.attack=key;this.enemyPose.state='telegraph';this.enemyPose.timer=ATTACKS[key].telegraph/this.opponent.speed;
  }

  executeAttack(){
    const enemy=this.enemyPose,attack=ATTACKS[enemy.attack];enemy.state='attack';enemy.timer=.19;enemy.avoided=false;
    const result=resolveIncomingDamage(attack.damage*this.opponent.power,{
      dodging:this.playerPose.state==='dodge',blocking:this.blockHeld,blockable:attack.blockable,stamina:this.stamina,
    });
    if(result.blocked)result.damage=Math.max(1,Math.round(result.damage*(this.fighter.blockEfficiency||1)));
    if(result.avoided){
      enemy.avoided=true;this.special=clamp(this.special+18,0,100);this.score+=250;
      this.hooks.onToast?.('ESQUIVA PERFEITA · CONTRA-ATAQUE AGORA');this.sound.sfx('dodge');
    }else{
      this.playerHealth=clamp(this.playerHealth-result.damage,0,this.fighter.health);this.stamina=clamp(this.stamina-result.staminaCost,0,100);
      this.playerPose.state=result.blocked&&this.blockHeld?'block':'hit';this.playerPose.actionTimer=result.blocked?.18:.45;
      this.playerPose.hitDirection=attack.side||1;this.impact={x:640,y:450,life:.25,maxLife:.25,color:result.blocked?'#8ecad1':'#d64b43'};
      this.shake=result.blocked?5:13;this.sound.sfx(result.blocked?'block':'cross');
      if(!result.blocked){this.combo=0;this.special=Math.max(0,this.special-35)}
      if(this.playerHealth<=0){this.knockOut(false);return}
    }
    this.updateHud();
  }

  dodge(direction){
    if(this.state!=='playing'||this.dodgeCooldown>0||['hit','special'].includes(this.playerPose.state))return;
    this.blockHeld=false;this.playerPose.state='dodge';this.playerPose.direction=direction;
    this.playerPose.actionTimer=this.fighter.dodgeDuration||.38;this.dodgeCooldown=.62/this.fighter.speed;this.sound.sfx('dodge');
  }

  setBlock(active){
    this.blockHeld=active&&this.state==='playing';
    if(this.blockHeld&&['idle','block'].includes(this.playerPose.state))this.playerPose.state='block';
    if(!this.blockHeld&&this.playerPose.state==='block')this.playerPose.state='idle';
  }

  punch(cross=false){
    if(this.state!=='playing'||this.punchCooldown>0||['dodge','hit','special'].includes(this.playerPose.state))return;
    const cost=cross?17:10;if(this.stamina<cost){this.hooks.onToast?.('SEM FÔLEGO · RECUPERE O AR');return}
    this.blockHeld=false;this.stamina-=cost;this.punchCooldown=(cross?.48:.31)/this.fighter.speed;
    this.playerPose.state=cross?'cross':'jab';this.playerPose.actionTimer=this.punchCooldown;
    const enemy=this.enemyPose,attack=ATTACKS[enemy.attack]||ATTACKS.jab;
    const counter=enemy.state==='telegraph'&&attack.counterable;
    const vulnerable=['recover','stunned','hit'].includes(enemy.state);
    const guarded=enemy.state==='idle'&&this.rng()<this.opponent.defense;
    const power=this.fighter.power*(counter?(this.fighter.counterPower||1):1);
    const result=resolvePlayerPunch({power,cross,counter,vulnerable,guarded});
    this.sound.sfx(cross?'cross':'jab');
    if(result.blocked){
      enemy.state='block';enemy.timer=.32;this.combo=0;this.impact={x:640,y:300,life:.18,maxLife:.18,color:'#8ecad1'};
      this.sound.sfx('block');this.hooks.onToast?.('GOLPE BLOQUEADO · ESPERE A ABERTURA');
    }else{
      this.enemyHealth=clamp(this.enemyHealth-result.damage,0,this.opponent.health);this.special=clamp(this.special+result.meter,0,100);
      this.combo+=1;this.bestCombo=Math.max(this.bestCombo,this.combo);this.score+=Math.round(result.damage*100*(1+this.combo*.08));
      enemy.state=counter?'stunned':'hit';enemy.timer=counter?1:.34;enemy.hitDirection=cross?1:-1;
      this.impact={x:640+(cross?20:-20),y:cross?265:285,life:.28,maxLife:.28,color:counter?'#f1bd43':'#f0eadc'};
      this.shake=cross?9:5;if(counter){this.sound.sfx('counter');this.hooks.onToast?.('CONTRA-GOLPE PERFEITO · ENERGIA BÔNUS')}
      if(this.enemyHealth<=0){this.knockOut(true);return}
    }
    this.updateHud();
  }

  useSpecial(){
    if(this.state!=='playing'||this.special<100||['dodge','hit','special'].includes(this.playerPose.state))return;
    this.special=0;this.blockHeld=false;this.playerPose.state='special';this.playerPose.actionTimer=.75;this.punchCooldown=.75;
    const damage=Math.round(34*this.fighter.power);this.enemyHealth=clamp(this.enemyHealth-damage,0,this.opponent.health);
    this.enemyPose.state='stunned';this.enemyPose.timer=1.15;this.combo+=2;this.bestCombo=Math.max(this.bestCombo,this.combo);
    this.score+=damage*160;this.shake=23;this.impact={x:640,y:275,life:.55,maxLife:.55,color:'#f1bd43'};
    this.sound.sfx('special');this.hooks.onToast?.(this.fighter.specialName);this.updateHud();
    if(this.enemyHealth<=0)this.knockOut(true);
  }

  knockOut(playerWon){
    if(this.state==='ko')return;this.state='ko';this.koTimer=2.35;this.pendingWin=playerWon;this.pendingReason='ko';
    if(playerWon)this.enemyPose.state='down';else this.playerPose.state='down';
    this.sound.stopMusic();this.sound.sfx('ko');this.hooks.onAnnounce?.('NOCAUTE!','red');
  }

  decision(){
    const winner=decisionWinner(this.playerHealth/this.fighter.health,this.enemyHealth/this.opponent.health);
    this.pendingWin=winner==='player';this.pendingReason=winner==='draw'?'draw':'decision';this.state='ended';this.sound.stopMusic();
    this.sound.sfx(this.pendingWin?'win':'lose');this.hooks.onEnd?.(this.resultData());
  }

  completeResult(){
    this.state='ended';this.sound.sfx(this.pendingWin?'win':'lose');this.hooks.onEnd?.(this.resultData());
  }

  resultData(){return{won:this.pendingWin,reason:this.pendingReason,score:Math.round(this.score+this.playerHealth*40+this.timeLeft*25),health:this.playerHealth/this.fighter.health,combo:this.bestCombo,opponentIndex:this.opponentIndex,last:this.opponentIndex===OPPONENTS.length-1}}

  togglePause(){
    if(['playing','intro'].includes(this.state)){
      this.stateBeforePause=this.state;this.state='paused';this.blockHeld=false;this.sound.stopMusic();this.hooks.onPause?.(true);
    }else if(this.state==='paused'){this.state=this.stateBeforePause;this.sound.startMusic();this.hooks.onPause?.(false)}
  }

  updateHud(){this.hooks.onUpdate?.({playerHealth:this.playerHealth/this.fighter.health,enemyHealth:this.enemyHealth/this.opponent.health,stamina:this.stamina,special:this.special,timeLeft:this.timeLeft,combo:this.combo,fighter:this.fighter,opponent:this.opponent})}

  render(){
    const ctx=this.ctx;ctx.clearRect(0,0,1280,720);ctx.save();
    if(this.shake)ctx.translate((Math.random()-.5)*this.shake,(Math.random()-.5)*this.shake);
    ctx.drawImage(this.background,0,0);drawArenaLights(ctx,this.time);
    if(['menu','selection','circuit'].includes(this.state)){
      drawBoxer(ctx,OPPONENTS.at(-1),{state:'idle',enemy:true},850,515,1.4,this.time);
      drawPlayerBack(ctx,DEFAULT_FIGHTER,{state:'idle'},390,680,1.55,this.time);
    }else{
      drawBoxer(ctx,this.opponent,this.enemyPose,640,480,1.42,this.time);
      drawPlayerBack(ctx,this.fighter,this.playerPose,640,700,1.62,this.time);
      if(this.enemyPose.state==='telegraph')this.drawTelegraph(ctx);
    }
    drawImpact(ctx,this.impact,this.time);drawArenaForeground(ctx);ctx.restore();
  }

  drawTelegraph(ctx){
    const attack=ATTACKS[this.enemyPose.attack],pulse=.75+Math.sin(this.time*15)*.2;
    ctx.save();ctx.globalAlpha=pulse;ctx.textAlign='center';ctx.fillStyle=attack.blockable?'#f1bd43':'#ff665e';
    ctx.font='700 17px "Courier New",monospace';ctx.fillText(attack.name,640,145);
    ctx.font='700 12px "Courier New",monospace';ctx.fillText(attack.blockable?'DEFENDA OU DESVIE':'IMPARÁVEL · DESVIE!',640,168);
    ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=2;ctx.beginPath();ctx.arc(640,280,100+Math.sin(this.time*12)*8,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
}
