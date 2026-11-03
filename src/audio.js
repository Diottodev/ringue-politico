export class SoundSystem {
  constructor(){this.context=null;this.muted=false;this.musicTimer=null;this.step=0}
  ensure(){if(this.muted)return false;try{this.context||=new(window.AudioContext||window.webkitAudioContext)();if(this.context.state==='suspended')this.context.resume();return true}catch{return false}}
  tone(f,d,w='square',v=.035,end=null,delay=0){if(!this.ensure())return;const t=this.context.currentTime+delay,o=this.context.createOscillator(),g=this.context.createGain();o.type=w;o.frequency.setValueAtTime(f,t);if(end)o.frequency.exponentialRampToValueAtTime(end,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(this.context.destination);o.start(t);o.stop(t+d+.03)}
  noise(d=.08,v=.05,high=900){if(!this.ensure())return;const length=Math.floor(this.context.sampleRate*d),buffer=this.context.createBuffer(1,length,this.context.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i+=1)data[i]=Math.random()*2-1;const source=this.context.createBufferSource(),filter=this.context.createBiquadFilter(),gain=this.context.createGain();filter.type='lowpass';filter.frequency.value=high;gain.gain.setValueAtTime(v,this.context.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,this.context.currentTime+d);source.buffer=buffer;source.connect(filter);filter.connect(gain);gain.connect(this.context.destination);source.start()}
  sfx(name){
    if(name==='click')this.tone(420,.05,'square',.025,560);
    if(name==='jab'){this.noise(.07,.05,1200);this.tone(130,.08,'sine',.035,70)}
    if(name==='cross'){this.noise(.12,.075,800);this.tone(105,.13,'sine',.06,45)}
    if(name==='block'){this.noise(.08,.03,400);this.tone(190,.06,'square',.02,130)}
    if(name==='dodge')this.noise(.12,.022,2100);
    if(name==='counter'){this.tone(660,.08,'square',.04);this.tone(990,.14,'triangle',.05,null,.07)}
    if(name==='special'){this.noise(.3,.09,650);this.tone(90,.4,'sawtooth',.06,35);this.tone(440,.35,'triangle',.04,880,.08)}
    if(name==='bell'){this.tone(880,.65,'sine',.07,860);this.tone(1320,.5,'sine',.04,1280,.03);this.tone(880,.6,'sine',.06,850,.75)}
    if(name==='ko'){this.tone(180,.8,'sawtooth',.06,42);this.noise(.4,.06,500)}
    if(name==='win')[392,494,587,784].forEach((n,i)=>this.tone(n,.4,'triangle',.05,null,i*.13));
    if(name==='lose'){this.tone(220,.8,'sawtooth',.05,50);this.tone(110,1,'square',.025,35,.2)}
  }
  startMusic(){if(this.musicTimer)return;this.step=0;this.musicTimer=setInterval(()=>{if(this.muted||!this.context)return;const notes=[55,55,65.4,55,73.4,65.4,49,55];this.tone(notes[this.step%8],.18,'triangle',.015);if(this.step%2===0)this.noise(.035,.008,350);this.step+=1},310)}
  stopMusic(){clearInterval(this.musicTimer);this.musicTimer=null}
  setMuted(muted){this.muted=muted;if(this.context){if(muted)this.context.suspend();else this.context.resume()}}
}
