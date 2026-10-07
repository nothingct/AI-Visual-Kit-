import type {ExplainerAppearance} from './appearance';

/** Connected radial layout; lines draw first and reveal attached labels in a stagger. */
export const ComponentNetwork = ({labels, appearance, progress}: {
  labels: string[]; appearance: ExplainerAppearance; progress: (index: number) => number;
}) => {
  const {language: g} = appearance;
  const positions = [
    {x: 450, y: 480, anchorX: 850, anchorY: 550, kneeX: 700},
    {x: 1470, y: 480, anchorX: 1070, anchorY: 550, kneeX: 1220},
    {x: 450, y: 780, anchorX: 850, anchorY: 745, kneeX: 700},
    {x: 1470, y: 780, anchorX: 1070, anchorY: 745, kneeX: 1220},
  ];
  return <div style={{position: 'absolute', inset: 0}}>
    <svg width="1920" height="1080" style={{position:'absolute', inset:0}}>
      {labels.map((label, i) => {
        const p = progress(i); const pos = positions[i];
        const end = pos.x < 960 ? pos.x + 145 : pos.x - 145;
        return <g key={i} opacity={p}>
          <path d={`M${pos.anchorX} ${pos.anchorY}H${pos.kneeX}L${pos.kneeX + (pos.x < 960 ? -65 : 65)} ${pos.y}H${end}`}
            fill="none" stroke={g.accent} strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p}/>
          <circle cx={pos.anchorX} cy={pos.anchorY} r="4" fill={g.accent}/>
        </g>;
      })}
    </svg>
    {labels.map((label, i) => {
      const p=progress(i);const pos=positions[i];
      return <div key={i} style={{position:'absolute',left:pos.x-145,top:pos.y-47,width:290,height:94,
        display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${g.controlBorder}`,
        borderRadius:g.radius.control,backgroundColor:g.controlSurface,backgroundImage:g.controlLayer,
        boxShadow:g.controlShadow,color:g.primaryText,fontSize:appearance.type.component,fontWeight:500,
        opacity:p,transform:`translateX(${(1-p)*(pos.x<960?12:-12)}px)`,letterSpacing:'-.02em'}}>{label}</div>;
    })}
  </div>;
};
