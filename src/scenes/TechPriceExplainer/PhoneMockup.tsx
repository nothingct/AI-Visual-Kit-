import {useId} from 'react';
import type {ExplainerAppearance} from './appearance';

/** Original unbranded OLED placeholder. Replace this component with a licensed product image. */
export const PhoneMockup = ({appearance, seconds, analysis}: {
  appearance: ExplainerAppearance; seconds: number; analysis: number;
}) => {
  const id = useId().replace(/:/g, '');
  const {language: g, device} = appearance;
  return <svg width="330" height="650" viewBox="0 0 330 650" role="img" aria-label="Unbranded premium phone mockup">
    <defs>
      <linearGradient id={`${id}metal`} x1="0" y1="0" x2="1" y2="0">
        <stop stopColor={device.metal}/><stop offset=".12" stopColor={device.rim}/>
        <stop offset=".86" stopColor={device.rim}/><stop offset="1" stopColor={device.highlight}/>
      </linearGradient>
      <linearGradient id={`${id}screen`} x1="0" y1="1" x2="1" y2="0">
        <stop stopColor={g.background}/><stop offset=".55" stopColor={g.surface}/><stop offset="1" stopColor={g.accent} stopOpacity=".36"/>
      </linearGradient>
      <linearGradient id={`${id}ribbon`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={g.accent} stopOpacity=".05"/><stop offset=".5" stopColor={g.accent} stopOpacity=".8"/>
        <stop offset="1" stopColor={g.primaryText} stopOpacity=".08"/>
      </linearGradient>
      <clipPath id={`${id}clip`}><rect x="15" y="14" width="300" height="622" rx="38"/></clipPath>
    </defs>
    <rect x="1" y="1" width="328" height="648" rx="49" fill={`url(#${id}metal)`}/>
    <rect x="7" y="7" width="316" height="636" rx="44" fill={device.glass}/>
    <rect x="15" y="14" width="300" height="622" rx="38" fill={`url(#${id}screen)`}/>
    <g clipPath={`url(#${id}clip)`}>
      <g transform={`translate(${Math.sin(seconds * 0.45) * 12}, ${Math.cos(seconds * 0.4) * 16})`} opacity={1 - analysis * 0.65}>
        {Array.from({length: 7}, (_, i) => <ellipse key={i} cx="226" cy="400" rx={70 + i * 23} ry={220 + i * 24}
          transform="rotate(-32 226 400)" fill="none" stroke={`url(#${id}ribbon)`} strokeWidth={i === 3 ? 20 : 1.5} />)}
      </g>
      <g opacity={analysis}>
        <path d="M165 114V545M64 222H266M64 414H266" stroke={g.accent} strokeOpacity=".32" strokeWidth="1"/>
        {[165, 280, 395, 510].map((y, i) => <g key={y}>
          <rect x={i % 2 === 0 ? 60 : 168} y={y - 35} width="100" height="70" rx="8" fill={g.surface} stroke={g.border}/>
          <path d={`M${i % 2 === 0 ? 82 : 190} ${y}h56`} stroke={g.accent} strokeWidth="2"/>
        </g>)}
      </g>
      <path d={`M15 ${100 + (seconds * 36) % 520}H315`} stroke={g.primaryText} strokeOpacity=".06" strokeWidth="30"/>
    </g>
    <circle cx="165" cy="32" r="5.5" fill={device.glass}/><circle cx="165" cy="32" r="2.5" fill={device.lens}/>
    <path d="M328 155v56M328 239v82" stroke={device.metal} strokeWidth="3" strokeLinecap="round"/>
    <path d="M40 5H290" stroke={device.highlight} strokeOpacity=".5" strokeWidth="1"/>
  </svg>;
};
