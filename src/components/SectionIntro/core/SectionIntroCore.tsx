import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {sectionIntroAppearance} from '../theme/appearance';
import type {SectionIntroTheme} from '../theme/types';
import {sectionIntroTiming} from '../timing';
import type {SectionIntroInput} from '../types';

/** Full-frame chapter layout and motion; knows no theme names or sample data. */
export const SectionIntroCore = ({input, theme}: {input: SectionIntroInput; theme: SectionIntroTheme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const motion = sectionIntroTiming(frame, fps);
  const styles = sectionIntroAppearance(theme, input.transparent);
  const {spacing, line} = theme;
  const reveal = (progress: number) => ({opacity: progress, transform: `translateY(${(1 - progress) * 14}px)`});
  return (
    <AbsoluteFill style={styles.canvas}>
      <div style={{position: 'absolute', inset: `${spacing.safeY}px ${spacing.safeX}px`, display: 'flex',
        flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{position: 'relative', height: line.thickness, marginBottom: line.gap}}>
          <div style={{...styles.baseline, position: 'absolute', inset: 0, opacity: motion.line}} />
          <div style={{...styles.line, width: line.width, height: line.thickness,
            transform: `scaleX(${motion.line})`, transformOrigin: 'left'}} />
        </div>
        <div data-section-number style={{...styles.number, ...reveal(motion.number),
          maxWidth: '100%', overflowWrap: 'anywhere'}}>{input.sectionNumber}</div>
        <div data-section-title style={{...styles.title, ...reveal(motion.title), marginTop: spacing.numberGap,
          overflowWrap: 'anywhere'}}>{input.title}</div>
        {input.subtitle && <div data-section-subtitle style={{...styles.subtitle, ...reveal(motion.subtitle),
          marginTop: spacing.subtitleGap, overflowWrap: 'anywhere'}}>{input.subtitle}</div>}
      </div>
    </AbsoluteFill>
  );
};
