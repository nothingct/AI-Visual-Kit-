import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {getGlobalTheme} from '../../design/themes/registry';
import {explainerAppearance} from './appearance';
import {ComponentNetwork} from './ComponentNetwork';
import {PhoneMockup} from './PhoneMockup';
import {validateExplainerInput, won} from './input';
import {explainerMotion, lerp, sceneTiming} from './timing';
import type {TechPriceExplainerInput} from './types';

/** Three choreographed beats: product hero → price shock → component-cost question. */
export const TechPriceExplainer = (input: TechPriceExplainerInput) => {
  validateExplainerInput(input);
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const m = explainerMotion(frame, fps);
  const a = explainerAppearance(getGlobalTheme(input.theme)); const g = a.language;
  const shockActive = m.t >= sceneTiming.shock[0];
  const phoneX = lerp(lerp(960, 1350, m.shift), 960, m.why);
  const phoneY = lerp(lerp(655, 560, m.shift), 650, m.why);
  const phoneScale = lerp(lerp(0.83, 0.96, m.shift), 0.73, m.why) * lerp(0.92, 1, m.phone);
  const priceValue = lerp(input.previousPrice, input.currentPrice, m.count);
  const pulseOpacity = shockActive ? Math.sin(m.pulse * Math.PI) * (1 - m.why) : 0;
  const emphasis = input.emphasisLabel?.trim() || `+${won(input.currentPrice-input.previousPrice)}`;
  return <AbsoluteFill style={{backgroundColor:g.background,backgroundImage:g.backgroundDepth,
    color:g.primaryText,fontFamily:g.fontFamily,overflow:'hidden'}}>
    {/* Atmospheric parallax lives behind content. Motion is deterministic, never random. */}
    <div style={{position:'absolute',inset:-120,opacity:.14,
      backgroundImage:`linear-gradient(${g.border} 1px, transparent 1px), linear-gradient(90deg, ${g.border} 1px, transparent 1px)`,
      backgroundSize:'100px 100px',transform:`perspective(1100px) rotateX(58deg) translateY(${m.t*5}px)`,
      maskImage:'linear-gradient(transparent, black 60%, transparent)'}}/>
    <div style={{position:'absolute',width:1150,height:1000,left:phoneX-575,top:phoneY-500,
      background:`radial-gradient(ellipse, ${g.accent} 0%, transparent 66%)`,opacity:.065,
      transform:`scale(${1+m.t*.013})`}}/>
    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 34% 53%, ${a.shock}, transparent 60%)`,opacity:pulseOpacity*.09}}/>
    <div style={{position:'absolute',left:160,top:72,right:160,display:'flex',justifyContent:'space-between',
      color:g.secondaryText,fontSize:26,letterSpacing:'.09em',opacity:m.phone}}>
      <span>PRICE / ANALYSIS</span><span>{input.contextLabel}</span>
    </div>
    {/* Title contracts and moves with the phone, rather than animating separate boxes. */}
    <div style={{position:'absolute',left:lerp(960,160,m.shift),top:lerp(138,158,m.shift),
      transform:`translateX(${lerp(-50,0,m.shift)}%) translateY(${(1-m.title)*22}px)`,
      opacity:m.title*(1-m.why),whiteSpace:'nowrap'}}>
      <div style={{fontSize:lerp(a.type.title,58,m.shift),fontWeight:650,letterSpacing:'-.045em',lineHeight:1.2}}>{input.title}</div>
      <div style={{fontSize:lerp(36,30,m.shift),color:g.secondaryText,marginTop:18,letterSpacing:'-.02em'}}>{input.subtitle}</div>
    </div>
    {/* Price values: numeric input drives a short count-up and one restrained push-in. */}
    <div style={{position:'absolute',left:160,top:350,width:960,opacity:m.price*(1-m.why),
      transform:`translateY(${(1-m.price)*30}px) scale(${1+Math.sin(m.pulse*Math.PI)*.026})`,transformOrigin:'35% 50%'}}>
      <div style={{fontSize:a.type.label,color:shockActive?a.shock:g.secondaryText,marginBottom:22,fontWeight:500}}>
        {shockActive?input.currentLabel:input.previousLabel}
      </div>
      <div data-explainer-price style={{fontSize:a.type.price,fontWeight:700,lineHeight:1.1,letterSpacing:'-.06em',fontVariantNumeric:'tabular-nums',whiteSpace:'nowrap'}}>
        {won(priceValue)}
      </div>
      <div style={{fontSize:36,color:g.secondaryText,marginTop:28,opacity:m.count,display:'flex',gap:24,alignItems:'center'}}>
        <span style={{textDecoration:'line-through',textDecorationThickness:1}}>{won(input.previousPrice)}</span>
        <span style={{color:a.shock}}>→</span><span>{input.increaseCaption}</span>
      </div>
      {/* Emphasis label is editable independently from numeric prices. */}
      <div style={{marginTop:44,display:'inline-flex',alignItems:'baseline',gap:22,opacity:m.emphasis,
        transform:`translateY(${(1-m.emphasis)*26}px) scale(${1+.07*Math.sin(m.emphasis*Math.PI)})`,transformOrigin:'left center'}}>
        <span style={{fontSize:60,color:a.shock,fontWeight:400}}>↑</span>
        <span style={{fontSize:a.type.emphasis,fontWeight:700,letterSpacing:'-.04em',color:a.shock}}>{emphasis}</span>
      </div>
    </div>
    {/* Single expanding impact ring; no repeated flash or pulse loop. */}
    <div style={{position:'absolute',left:520,top:525,width:240,height:240,marginLeft:-120,marginTop:-120,
      border:`1.5px solid ${a.shock}`,borderRadius:'50%',opacity:pulseOpacity*.5,
      transform:`scale(${lerp(.5,5,m.pulse)})`,pointerEvents:'none'}}/>
    {/* A persistent device bridges all three beats with a camera-like orbit and change of scale. */}
    <div style={{position:'absolute',left:phoneX,top:phoneY,width:330,height:650,opacity:m.phone,
      transform:`translate(-50%, -50%) perspective(1500px) rotateY(${lerp(-18 + Math.sin(m.t * .55) * 4,0,m.why)}deg) rotateZ(${lerp(-5,0,m.why)}deg) scale(${phoneScale})`,
      filter:`drop-shadow(0 35px 40px ${g.background})`}}>
      <PhoneMockup appearance={a} seconds={m.t} analysis={m.why}/>
    </div>
    {/* Question and component labels: editable copy; lines connect to the device, not a slide grid. */}
    <div style={{position:'absolute',left:160,right:160,top:162,textAlign:'center',opacity:m.question,
      transform:`translateY(${(1-m.question)*24}px) scale(${lerp(.97,1,m.question)})`}}>
      <div data-explainer-question style={{fontSize:a.type.question,fontWeight:650,letterSpacing:'-.055em'}}>{input.question}</div>
      <div style={{fontSize:32,color:g.secondaryText,marginTop:16}}>{input.whySubtitle}</div>
    </div>
    <ComponentNetwork labels={input.componentLabels} appearance={a} progress={m.connections}/>
    <div style={{position:'absolute',left:160,bottom:64,color:g.secondaryText,fontSize:24,opacity:m.phone}}>{input.priceNote}</div>
    <div style={{position:'absolute',right:160,bottom:64,display:'flex',gap:12,alignItems:'center',opacity:m.phone}}>
      {[0,1,2].map((i)=><div key={i} style={{height:3,width:i===0?72:36,
        backgroundColor:i===(m.why>.5?2:m.shift>.5?1:0)?g.accent:g.border}}/>)}
    </div>
  </AbsoluteFill>;
};
