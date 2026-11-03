import { createRng } from './logic.js';

const TAU = Math.PI * 2;
function rounded(ctx,x,y,w,h,r){const q=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+q,y);ctx.arcTo(x+w,y,x+w,y+h,q);ctx.arcTo(x+w,y+h,x,y+h,q);ctx.arcTo(x,y+h,x,y,q);ctx.arcTo(x,y,x+w,y,q);ctx.closePath()}
function ellipse(ctx,x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=color;ctx.fill()}
function text(ctx,value,x,y,size,color,align='center',weight='700'){ctx.fillStyle=color;ctx.font=`${weight} ${size}px "Arial Black",sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(value,x,y)}
function star(ctx,x,y,r,color){ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<10;i+=1){const a=-Math.PI/2+i*Math.PI/5;const d=i%2?r*.45:r;const px=x+Math.cos(a)*d,py=y+Math.sin(a)*d;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py)}ctx.closePath();ctx.fill()}

export function createArena() {
  const canvas = document.createElement('canvas');
  canvas.width = 1280; canvas.height = 720;
  const ctx = canvas.getContext('2d');
  const rng = createRng(13013);
  const background = ctx.createLinearGradient(0,0,0,720);
  background.addColorStop(0,'#070912'); background.addColorStop(.55,'#192232'); background.addColorStop(1,'#090c15');
  ctx.fillStyle=background;ctx.fillRect(0,0,1280,720);

  for(let i=0;i<6;i+=1){
    const x=90+i*220;
    const beam=ctx.createLinearGradient(x,0,640,520);
    beam.addColorStop(0,'#d9e8ef18');beam.addColorStop(1,'#d9e8ef00');
    ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(x-15,0);ctx.lineTo(x+15,0);ctx.lineTo(800+i*20,560);ctx.lineTo(440+i*15,560);ctx.closePath();ctx.fill();
    ellipse(ctx,x,14,30,8,'#e6eef0');ellipse(ctx,x,15,14,5,'#fff7d0');
  }

  ctx.fillStyle='#0a0e18';ctx.fillRect(0,110,1280,235);
  const crowdColors=['#222b3b','#2b3141','#303444','#1d2937','#3b3038'];
  for(let row=0;row<5;row+=1){
    const y=140+row*42;
    for(let col=0;col<36;col+=1){
      const x=col*38+(row%2)*17+rng()*8;
      const color=crowdColors[Math.floor(rng()*crowdColors.length)];
      ellipse(ctx,x,y,10+rng()*4,12+rng()*4,color);
      ctx.fillStyle=color;ctx.fillRect(x-13,y+8,26,28);
      if(rng()>.9){ctx.fillStyle=rng()>.5?'#a73936':'#c5a340';ctx.fillRect(x-12,y-20,24,14)}
    }
  }
  ctx.fillStyle='#0b111dcc';ctx.fillRect(0,287,1280,66);
  ctx.fillStyle='#b63835';ctx.fillRect(0,292,1280,4);
  text(ctx,'CINTURÃO POPULAR',640,319,29,'#e6c158');
  text(ctx,'GINÁSIO DA REPÚBLICA · TRANSMISSÃO NACIONAL',640,342,9,'#d5d8d099');

  ctx.fillStyle='#111925';ctx.fillRect(125,250,18,320);ctx.fillRect(1137,250,18,320);
  ctx.fillStyle='#b83e3a';rounded(ctx,116,270,36,76,5);ctx.fill();rounded(ctx,1128,270,36,76,5);ctx.fill();
  text(ctx,'13',134,307,17,'#f0eadc');text(ctx,'13',1146,307,17,'#f0eadc');

  const floor=ctx.createLinearGradient(0,330,0,720);
  floor.addColorStop(0,'#8c999e');floor.addColorStop(.5,'#647780');floor.addColorStop(1,'#40525e');
  ctx.fillStyle=floor;ctx.beginPath();ctx.moveTo(150,330);ctx.lineTo(1130,330);ctx.lineTo(1280,720);ctx.lineTo(0,720);ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(150,330);ctx.lineTo(1130,330);ctx.lineTo(1280,720);ctx.lineTo(0,720);ctx.closePath();ctx.clip();
  for(let i=0;i<900;i+=1){ctx.fillStyle=rng()>.5?'#ffffff0a':'#0000000b';ctx.fillRect(rng()*1280,330+rng()*390,1+rng()*3,1+rng()*2)}
  ctx.strokeStyle='#d9e1dc13';ctx.lineWidth=2;
  for(let x=100;x<1280;x+=120){ctx.beginPath();ctx.moveTo(640+(x-640)*.7,330);ctx.lineTo(x,720);ctx.stroke()}
  ctx.translate(640,535);ctx.scale(1.5,.62);ctx.rotate(-.05);
  ctx.strokeStyle='#e1d8b51c';ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,175,0,TAU);ctx.stroke();
  text(ctx,'PUNHOS',0,-28,48,'#e1d8b51c');text(ctx,'DA REPÚBLICA',0,25,32,'#e1d8b51c');
  ctx.restore();

  for(const [y,color] of [[260,'#d8d9d2'],[292,'#b73c3b'],[326,'#d8d9d2']]){
    ctx.strokeStyle='#0006';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(135,y+4);ctx.lineTo(1145,y+4);ctx.stroke();
    ctx.strokeStyle=color;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(135,y);ctx.lineTo(1145,y);ctx.stroke();
  }
  return canvas;
}

export function drawArenaLights(ctx,time){
  ctx.save();ctx.globalCompositeOperation='screen';
  const x=640+Math.sin(time*.35)*330;
  const glow=ctx.createRadialGradient(x,390,10,x,390,340);
  glow.addColorStop(0,'#fff0bd0c');glow.addColorStop(1,'#fff0bd00');
  ctx.fillStyle=glow;ctx.fillRect(0,80,1280,600);ctx.restore();
}

export function drawArenaForeground(ctx){
  for(const [y,color] of [[608,'#d8d9d2'],[648,'#b73c3b'],[690,'#d8d9d2']]){
    ctx.strokeStyle='#0007';ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(-20,y+5);ctx.lineTo(1300,y+5);ctx.stroke();
    ctx.strokeStyle=color;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(1300,y);ctx.stroke();
  }
  ctx.fillStyle='#101925';ctx.fillRect(20,565,24,155);ctx.fillRect(1236,565,24,155);
  ctx.fillStyle='#b83e3a';rounded(ctx,9,579,46,83,5);ctx.fill();rounded(ctx,1225,579,46,83,5);ctx.fill();
}

function drawHairAndFace(ctx,fighter,back=false){
  const hair=fighter.hair||'#342b27',light=fighter.hairLight||hair;
  if(fighter.hairStyle==='long'){
    ctx.fillStyle=hair;rounded(ctx,-32,-239,64,91,22);ctx.fill();
    ctx.fillStyle=light;ctx.fillRect(-29,-218,5,58);ctx.fillRect(24,-218,5,58);
  }
  ellipse(ctx,-27,-199,7,10,fighter.skin);ellipse(ctx,27,-199,7,10,fighter.skin);
  ellipse(ctx,0,-201,29,34,fighter.skin);
  ctx.fillStyle=fighter.skinShadow||'#0003';ctx.beginPath();ctx.ellipse(10,-198,18,29,0,-Math.PI/2,Math.PI/2);ctx.fill();
  if(back){
    ctx.fillStyle=hair;ctx.beginPath();ctx.arc(0,-205,30,Math.PI,TAU);ctx.lineTo(27,-196);ctx.quadraticCurveTo(0,-183,-27,-196);ctx.closePath();ctx.fill();
    ctx.fillStyle=light;ctx.beginPath();ctx.arc(-4,-209,21,Math.PI*1.1,Math.PI*1.8);ctx.lineTo(10,-201);ctx.closePath();ctx.fill();
    return;
  }
  if(fighter.beard==='full'){
    ctx.fillStyle=hair;ctx.beginPath();ctx.moveTo(-26,-202);ctx.quadraticCurveTo(-24,-165,0,-164);ctx.quadraticCurveTo(25,-165,26,-202);ctx.lineTo(17,-190);ctx.quadraticCurveTo(0,-176,-17,-190);ctx.closePath();ctx.fill();
    ctx.fillStyle=light;ctx.fillRect(-17,-180,3,7);ctx.fillRect(14,-180,3,7);
  }else if(fighter.beard==='stubble'){
    ctx.fillStyle=`${hair}99`;for(let i=0;i<9;i+=1)ctx.fillRect(-17+i*4,-177-Math.abs(4-i),2,2);
  }
  if(fighter.hairStyle==='swoop'){
    ctx.fillStyle=hair;ctx.beginPath();ctx.moveTo(-30,-208);ctx.bezierCurveTo(-39,-242,8,-249,29,-227);ctx.lineTo(35,-208);ctx.lineTo(20,-218);ctx.bezierCurveTo(5,-228,-6,-214,-25,-214);ctx.closePath();ctx.fill();
    ctx.fillStyle=light;ctx.beginPath();ctx.moveTo(-24,-228);ctx.quadraticCurveTo(2,-242,25,-221);ctx.lineTo(19,-216);ctx.quadraticCurveTo(0,-231,-22,-216);ctx.closePath();ctx.fill();
  }else if(fighter.hairStyle==='short'||fighter.hairStyle==='long'){
    ctx.fillStyle=hair;ctx.beginPath();ctx.moveTo(-29,-207);ctx.quadraticCurveTo(-28,-240,0,-241);ctx.quadraticCurveTo(29,-240,30,-207);ctx.lineTo(20,-220);ctx.quadraticCurveTo(0,-230,-22,-214);ctx.closePath();ctx.fill();
    ctx.fillRect(-29,-215,6,18);ctx.fillRect(23,-215,6,18);
    ctx.fillStyle=light;ctx.beginPath();ctx.moveTo(-18,-229);ctx.quadraticCurveTo(0,-239,18,-225);ctx.lineTo(13,-220);ctx.quadraticCurveTo(0,-231,-15,-218);ctx.closePath();ctx.fill();
  }else{
    ctx.fillStyle=hair;ctx.fillRect(-29,-214,5,15);ctx.fillRect(24,-214,5,15);
  }
  ellipse(ctx,-10,-201,4,3,'#f4eee1');ellipse(ctx,10,-201,4,3,'#f4eee1');
  ellipse(ctx,-10,-201,2,2,'#14202a');ellipse(ctx,10,-201,2,2,'#14202a');
  ctx.strokeStyle=hair;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-17,-211);ctx.lineTo(-5,-210);ctx.moveTo(5,-210);ctx.lineTo(17,-211);ctx.stroke();
  if(fighter.glasses){ctx.strokeStyle='#171d23';ctx.lineWidth=2.5;ctx.strokeRect(-21,-209,18,14);ctx.strokeRect(3,-209,18,14);ctx.beginPath();ctx.moveTo(-3,-202);ctx.lineTo(3,-202);ctx.stroke();ctx.fillStyle='#ffffff55';ctx.fillRect(-17,-206,6,2);ctx.fillRect(7,-206,6,2)}
  ctx.strokeStyle=fighter.beard==='full'?'#d7ac8e':'#734a3b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-184,7,.2,Math.PI-.2);ctx.stroke();
  if(fighter.hairStyle==='long'){ellipse(ctx,-29,-191,3,4,'#e7bd53');ellipse(ctx,29,-191,3,4,'#e7bd53')}
}

function drawGlove(ctx,x,y,color,scale=1,angle=0){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);
  ctx.fillStyle=color;rounded(ctx,-17,-17,34,36,13);ctx.fill();
  ellipse(ctx,0,-10,17,16,color);ellipse(ctx,13,3,9,12,color);
  ctx.fillStyle='#ffffff20';ctx.beginPath();ctx.ellipse(-5,-14,7,4,-.4,0,TAU);ctx.fill();
  ctx.fillStyle='#20242b';ctx.fillRect(-15,14,30,6);ctx.restore();
}

export function drawBoxer(ctx,fighter,pose,x,y,scale=1,time=0){
  const state=pose.state||'idle';
  const attack=pose.attack||'jab';
  const down=state==='down';
  const hit=state==='hit';
  const bob=down?0:Math.sin(time*3.5+(pose.enemy?1:0))*3;
  ctx.save();ctx.translate(x,y+bob);ctx.scale(scale*(fighter.broad||1),scale);
  if(down){ctx.translate(25,-5);ctx.rotate(Math.PI/2.15);ctx.globalAlpha=.85}
  if(hit)ctx.rotate((pose.hitDirection||1)*.09);
  ellipse(ctx,0,5,54,13,'#00000055');

  ctx.fillStyle='#202632';ctx.fillRect(-38,-66,29,63);ctx.fillRect(9,-66,29,63);
  ellipse(ctx,-25,0,26,9,'#111722');ellipse(ctx,25,0,26,9,'#111722');
  ctx.fillStyle=fighter.trunks;ctx.beginPath();ctx.moveTo(-48,-121);ctx.lineTo(48,-121);ctx.lineTo(42,-52);ctx.lineTo(5,-52);ctx.lineTo(0,-82);ctx.lineTo(-5,-52);ctx.lineTo(-42,-52);ctx.closePath();ctx.fill();
  ctx.fillStyle=fighter.trunksLight;ctx.beginPath();ctx.moveTo(-45,-116);ctx.lineTo(-12,-116);ctx.lineTo(-8,-57);ctx.lineTo(-39,-57);ctx.closePath();ctx.fill();
  ctx.fillStyle=fighter.shortsStripe||'#e7d9b8';ctx.fillRect(-48,-118,96,10);ctx.fillRect(-45,-108,7,49);ctx.fillRect(38,-108,7,49);
  text(ctx,fighter.id==='lula'||fighter.id==='janones'||fighter.id==='jones'?'13':'BR',0,-113,8,fighter.shortsStripe||'#e7d9b8');

  ctx.fillStyle=fighter.skin;ctx.beginPath();ctx.moveTo(-39,-178);ctx.quadraticCurveTo(-50,-141,-43,-103);ctx.lineTo(43,-103);ctx.quadraticCurveTo(50,-141,39,-178);ctx.quadraticCurveTo(0,-194,-39,-178);ctx.closePath();ctx.fill();
  ctx.fillStyle=fighter.skinShadow||'#0003';ctx.beginPath();ctx.moveTo(12,-182);ctx.quadraticCurveTo(46,-174,42,-105);ctx.lineTo(17,-105);ctx.closePath();ctx.fill();
  ctx.fillStyle=fighter.trunks;ctx.beginPath();ctx.moveTo(-40,-176);ctx.lineTo(-22,-181);ctx.lineTo(-13,-135);ctx.lineTo(13,-135);ctx.lineTo(22,-181);ctx.lineTo(40,-176);ctx.lineTo(43,-112);ctx.lineTo(-43,-112);ctx.closePath();ctx.fill();
  ctx.fillStyle=fighter.trunksLight;ctx.beginPath();ctx.moveTo(-38,-171);ctx.lineTo(-24,-176);ctx.lineTo(-17,-137);ctx.lineTo(-35,-124);ctx.closePath();ctx.fill();
  if(fighter.id==='lula'||fighter.id==='janones'||fighter.id==='jones')star(ctx,0,-151,12,'#eee3cf');
  else text(ctx,'BR',0,-151,14,fighter.shortsStripe||'#e7d9b8');

  let left={x:-50,y:-151,s:1,a:-.25},right={x:50,y:-151,s:1,a:.25};
  if(state==='block'){left={x:-23,y:-199,s:1.1,a:-.1};right={x:23,y:-199,s:1.1,a:.1}}
  if(state==='telegraph'){
    if(attack==='hookLeft')left={x:-78,y:-177,s:1.15,a:-.8};
    else if(attack==='hookRight')right={x:78,y:-177,s:1.15,a:.8};
    else if(attack==='uppercut')right={x:34,y:-95,s:1.25,a:.4};
    else right={x:55,y:-166,s:1.1,a:.3};
  }
  if(state==='attack'){
    if(attack==='hookLeft')left={x:58,y:-152,s:1.65,a:1.2};
    else if(attack==='hookRight')right={x:-58,y:-152,s:1.65,a:-1.2};
    else if(attack==='uppercut')right={x:0,y:-195,s:1.85,a:0};
    else right={x:0,y:-200,s:1.55,a:0};
  }
  if(state==='stunned'){left={x:-70,y:-107,s:.9,a:-.5};right={x:70,y:-107,s:.9,a:.5}}
  ctx.strokeStyle=fighter.skin;ctx.lineWidth=23;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-36,-166);ctx.lineTo(left.x,left.y);ctx.moveTo(36,-166);ctx.lineTo(right.x,right.y);ctx.stroke();
  drawGlove(ctx,left.x,left.y,fighter.gloves,left.s,left.a);drawGlove(ctx,right.x,right.y,fighter.gloves,right.s,right.a);
  drawHairAndFace(ctx,fighter,false);
  if(state==='stunned')for(let i=0;i<3;i+=1){const a=time*3+i*TAU/3;star(ctx,Math.cos(a)*43,-245+Math.sin(a)*10,6,'#f1bd43')}
  ctx.restore();
}

export function drawPlayerBack(ctx,fighter,pose,x,y,scale=1,time=0){
  const state=pose.state||'idle';
  const dodge=state==='dodge'?(pose.direction||1)*105:0;
  const bob=state==='down'?0:Math.sin(time*4)*2;
  ctx.save();ctx.translate(x+dodge,y+bob);ctx.scale(scale,scale);if(state==='down'){ctx.translate(60,-10);ctx.rotate(-Math.PI/2.2);ctx.globalAlpha=.85}if(state==='dodge')ctx.rotate((pose.direction||1)*-.1);if(state==='hit')ctx.rotate((pose.hitDirection||1)*.12);
  ellipse(ctx,0,3,58,13,'#00000066');
  ctx.fillStyle='#1c2430';ctx.fillRect(-39,-58,30,56);ctx.fillRect(9,-58,30,56);
  ctx.fillStyle=fighter.trunks;ctx.beginPath();ctx.moveTo(-49,-123);ctx.lineTo(49,-123);ctx.lineTo(43,-45);ctx.lineTo(6,-45);ctx.lineTo(0,-75);ctx.lineTo(-6,-45);ctx.lineTo(-43,-45);ctx.closePath();ctx.fill();
  ctx.fillStyle=fighter.shortsStripe||'#e7d9b8';ctx.fillRect(-49,-120,98,11);ctx.fillRect(-45,-109,8,54);ctx.fillRect(37,-109,8,54);
  ctx.fillStyle=fighter.skin;ctx.beginPath();ctx.moveTo(-43,-184);ctx.quadraticCurveTo(-55,-146,-44,-111);ctx.lineTo(44,-111);ctx.quadraticCurveTo(55,-146,43,-184);ctx.closePath();ctx.fill();
  ctx.fillStyle=fighter.trunks;ctx.beginPath();ctx.moveTo(-42,-181);ctx.lineTo(-24,-183);ctx.lineTo(-18,-142);ctx.lineTo(18,-142);ctx.lineTo(24,-183);ctx.lineTo(42,-181);ctx.lineTo(44,-113);ctx.lineTo(-44,-113);ctx.closePath();ctx.fill();
  ctx.fillStyle=fighter.trunksLight;ctx.fillRect(-42,-176,12,58);
  text(ctx,'13',0,-151,22,fighter.shortsStripe||'#e7d9b8');

  let left={x:-48,y:-172,s:1,a:-.2},right={x:48,y:-172,s:1,a:.2};
  if(state==='block'){left={x:-25,y:-218,s:1.15,a:0};right={x:25,y:-218,s:1.15,a:0}}
  if(state==='jab')left={x:-18,y:-265,s:1.25,a:0};
  if(state==='cross')right={x:18,y:-275,s:1.4,a:0};
  if(state==='special'){left={x:-25,y:-278,s:1.55,a:0};right={x:25,y:-278,s:1.55,a:0}}
  ctx.strokeStyle=fighter.skin;ctx.lineWidth=25;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-38,-173);ctx.lineTo(left.x,left.y);ctx.moveTo(38,-173);ctx.lineTo(right.x,right.y);ctx.stroke();
  drawHairAndFace(ctx,fighter,true);
  drawGlove(ctx,left.x,left.y,fighter.gloves,left.s,left.a);drawGlove(ctx,right.x,right.y,fighter.gloves,right.s,right.a);
  ctx.restore();
}

export function drawImpact(ctx,impact,time){
  if(!impact)return;const progress=1-impact.life/impact.maxLife;const radius=15+progress*55;
  ctx.save();ctx.translate(impact.x,impact.y);ctx.globalAlpha=Math.max(0,impact.life/impact.maxLife);ctx.strokeStyle=impact.color||'#f1bd43';ctx.lineWidth=4;
  for(let i=0;i<9;i+=1){const a=i*TAU/9+time;ctx.beginPath();ctx.moveTo(Math.cos(a)*radius*.45,Math.sin(a)*radius*.45);ctx.lineTo(Math.cos(a)*radius,Math.sin(a)*radius);ctx.stroke()}
  ctx.restore();
}
