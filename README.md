# IT Visual Kit — Global Shared Theme Architecture v0.1

PriceChangeCard는 v0.3 디자인과 public input을 유지하며, 테마 공급 경로만 전역 공유 구조로 변경했습니다.

YouTube IT 콘텐츠에서 반복해서 사용할 React + Remotion + TypeScript 영상용 그래픽 키트입니다. v0.3에는 **PriceChangeCard 하나만** 구현되어 있습니다. 기본 출력은 **1920×1080 / 30fps / 2.5초**이며, PNG 스틸과 H.264 MP4를 CapCut에 바로 가져올 수 있습니다.

## 1. 설치

Node.js **22.18 이상**과 npm이 필요합니다.

```bash
npm ci
```

Remotion 패키지는 같은 버전으로 고정하고 `package-lock.json`을 포함했습니다. 한글은 패키지에 포함된 Noto Sans KR 폰트를 사용하므로 렌더 중 외부 폰트 서비스에 연결하지 않습니다.

렌더에는 Chrome Headless Shell 또는 Chromium이 필요합니다. 이 클라우드에서는 `/usr/bin/chromium`을 자동 사용합니다. 다른 환경에서는 다음 명령으로 Remotion의 브라우저를 준비하세요.

```bash
npx remotion browser ensure
```

별도 브라우저를 쓰려면 `REMOTION_BROWSER_EXECUTABLE` 환경변수에 실행 파일 경로를 지정하세요. 설치나 렌더에 API 키는 필요하지 않습니다.

## 2. 실행 및 Remotion Browser Preview

```bash
npm start
# 같은 명령: npm run studio
```

로컬 환경에서 브라우저로 `http://localhost:3000`을 열고 **PriceChangeCard**를 선택합니다. 재생 버튼으로 애니메이션을 보고, 타임라인을 이동해 각 프레임을 확인할 수 있습니다. 클라우드에서 외부 접속할 수 있는 Preview 주소는 실행 플랫폼의 포트 지원 여부에 따라 달라집니다.

타입 검사와 테스트:

```bash
npm run typecheck
npm test
```

## 3. 외부 입력: v0.3 canonical input과 기존 props

`src/data/price-change.input.json`은 향후 Control Panel에서도 전달할 수 있는 **PriceChangeCardInput** 예시입니다. 컴포넌트/Core 내부에 제품명이나 가격을 하드코딩하지 않습니다.

```json
{
  "productName": "Galaxy S26 Ultra 256GB",
  "previousPrice": "1,797,400원",
  "currentPrice": "1,947,000원",
  "delta": "+149,600원",
  "percentage": "+8.3%",
  "period": "2026.03 → 2026.10",
  "priceType": "공식 출고가",
  "source": "Samsung Korea",
  "direction": "up",
  "theme": "techDynamic"
}
```

위 데이터는 사용자가 제공한 Preview 예시입니다. 가격·증감은 통화/부호/쉼표를 포함한 표시 문자열이며 자동 계산하지 않습니다. `direction`은 up/down/neutral, `theme` 기본값은 techDynamic입니다. `transparent?: boolean`, Composition의 `renderFps?: 30 | 60`도 유지합니다.

기존 `src/data/price-change.sample.json`과 기존 props는 **변경 없이** 지원합니다. 기존 `PriceChangeCardProps` 타입은 legacy 필드 접근을 유지하며, 새 호출자는 `PriceChangeCardInput`을 사용합니다. 컴포넌트 진입점은 둘 다 받는 `PriceChangeCardPublicProps`를 사용합니다.

| 기존 v0.2.1 필드 | canonical input |
| --- | --- |
| oldPrice | previousPrice |
| newPrice | currentPrice |
| deltaPercent | percentage |
| dateLabel | period |
| sourceLabel | source |

productName, delta, priceType, direction, theme, transparent는 이름이 같습니다. `input.ts`의 `normalizePriceChangeInput()`이 alias를 변환하고 필수 문자열·방향·투명도 타입을 검증합니다. Remotion이 기존 Preview 기본 props와 새 input을 합칠 때 **canonical 필드가 우선**합니다. 빈 문자열/null인 canonical 값은 기본값으로 숨기지 않고 오류를 냅니다. 외부 호출자는 일관된 데이터를 위해 canonical 필드 전체를 제공하는 것을 권장합니다.

```tsx
import {PriceChangeCard} from './src/components/PriceChangeCard/PriceChangeCard';
import type {PriceChangeCardInput} from './src/components/PriceChangeCard/types';

// Remotion Composition 안에서 외부 객체를 그대로 전달할 수 있습니다.
const input: PriceChangeCardInput = /* 위 JSON에 해당하는 외부 입력 */ externalInput;
<PriceChangeCard {...input} />;
```

새로운 Data 관리 시스템이나 Control Panel은 만들지 않았습니다.

```bash
npm run studio -- --props=./src/data/price-change.input.json
npm run render:mp4 -- --props ./src/data/price-change.input.json
npm run render:png -- --props ./src/data/price-change.input.json
# 기존 파일도 계속 지원
npm run render:png -- --props ./src/data/price-change.sample.json
```

기본 Preview는 기존 sample.json을 계속 사용합니다. Studio의 “Save default props”는 외부 JSON 참조를 자동 수정하지 못하므로 JSON 파일 편집 또는 `--props`로 입력하세요. Studio에서 60fps를 확인하려면 별도 JSON에 `"renderFps": 60`을 추가하세요. `--fps` 렌더 옵션은 JSON보다 우선합니다.

## 4. MP4 렌더 및 CapCut 사용

저장소 루트에서 실행하세요.

```bash
npm run render:mp4
# 기본 파일: out/price-change.mp4

npm run render:mp4 -- --props ./src/data/price-change.sample.json --output out/galaxy.mp4
```

1920×1080, H.264, yuv420p, BT.709, CRF 18, 무음 MP4로 출력합니다. CapCut에서 파일을 가져와 영상 트랙에 놓으면 됩니다. 기본 길이는 2.5초입니다. MP4는 투명도를 지원하지 않습니다.

## 5. PNG / 스틸 이미지 렌더

```bash
npm run render:png
# 기본 파일: out/price-change.png

npm run render:png -- --output out/galaxy.png
# 선택 프레임을 스틸로 저장 (30fps에서 0~74)
npm run render:png -- --frame 45 --output out/frame-45.png
```

기본 스틸은 **모든 정보가 보이는 마지막 프레임**입니다. PNG는 1920×1080입니다. CapCut에서 이미지로 가져온 후 원하는 길이로 늘려 사용할 수 있습니다.

투명 캔버스의 PNG 오버레이:

```bash
npm run render:png -- --transparent --output out/price-change-overlay.png
```

카드 외부의 캔버스만 투명해지고 가독성을 위한 카드 표면은 유지됩니다. CapCut에서 원본 영상 위 트랙에 놓으세요. 투명 영상(WebM / ProRes 4444)은 이번 버전에 구현하지 않았습니다. 컴포넌트의 `transparent` prop을 기반으로 나중에 확장할 수 있습니다.

## 6. 30fps / 60fps

```bash
npm run render:mp4 -- --fps 30
npm run render:mp4 -- --fps 60 --output out/price-change-60.mp4
npm run render:png -- --fps 60 --output out/price-change-60.png
```

30fps는 **75프레임**, 60fps는 **150프레임**입니다. FPS 변경과 함께 전체 프레임 수를 계산하므로 재생 시간은 항상 2.5초입니다. PNG의 FPS는 선택할 프레임과 애니메이션 타이밍에만 영향을 줍니다. `--fps` 옵션은 JSON의 `renderFps`보다 우선합니다.

직접 Remotion CLI를 사용할 때도 FPS만 덮어쓰지 말고, props의 `renderFps`를 사용하세요. 등록된 `calculateMetadata`가 FPS와 프레임 수를 함께 계산합니다.

```bash
npx remotion render src/index.ts PriceChangeCard out/direct-60.mp4 --props='{"renderFps":60}'
```

## 7. v0.2.1 디자인을 그대로 유지한 v0.3

기본 테마는 **techDynamic**입니다. OLED/플래그십 IT 제품에서 연상되는 deep navy, near-black, blue/cyan 무드를 사용합니다. 공식 Samsung UI, 로고, One UI 요소를 사용하거나 복제하지 않습니다.

- 미세한 radial gradient 배경과 불투명한 카드 바탕 위의 레이어 gradient로 깊이를 표현합니다.
- 얇은 blue border, 절제된 cyan 상단 edge, 약한 shadow를 사용합니다. 배경 blur, RGB, 외부 네온 glow는 없습니다.
- white/blue/cyan으로 통일하고 orange/red를 제거했습니다. 상승은 ice cyan, 하락은 cool periwinkle-blue, 유지는 blue-gray입니다. 방향은 색보다 ↑/↓/— 및 가격 상승/하락/유지 라벨과 가격·증감 문자열로 전달합니다. 화살표는 모든 방향에서 cyan을 사용합니다.
- 금액 chip은 white, 비율 chip과 방향 pill은 방향별 cool accent입니다. dark navy 바탕에 얇은 cyan border, 미세한 gradient와 내부 highlight/약한 shadow를 적용했습니다.
- 현재 가격 라벨의 장식 선을 제거하고 blue-gray의 500 weight로 정돈했습니다. 화살표 선은 3px→2.25px로 다듬고 화살촉도 작게 조정했습니다. 출처는 40px를 유지하고 footer 간격만 24px→22px로 조정했습니다.
- 현재 가격은 154px에서 **134px**로 약 13% 줄이고, 이전 가격 **70px**과 같은 가로 흐름에 배치했습니다. `이전 가격 → 현재 가격`이 하나의 관계로 읽힙니다.
- 증감 금액/비율은 같은 크기의 독립 chip으로 분리했습니다. 제품명은 600 weight, 보조정보는 34px, 출처는 기존 26px에서 **40px**로 확대했습니다. footer의 가격 종류 중복은 제거했습니다.
- 1920×1080에서 카드의 폭은 **1600px (83.3%)**, 높이는 820px입니다. 좌우 160px, 상하 130px safe margin을 유지합니다.

긴 가격은 각 열의 폭에 맞춰 글자 크기를 줄이며, 긴 제품명은 한 줄 말줄임을 적용합니다. 모바일 확인은 PNG를 **384×216 또는 480×270**으로 축소해 이전/현재 가격과 증감이 읽히는지 검토하세요. 매우 긴 보조정보는 Preview에서 확인해 간결하게 편집하세요.

| 시간 | 동작 |
| --- | --- |
| 0.0~0.35초 | 카드·제품명·meta·출처가 작은 수직 이동과 fade로 등장 |
| 0.35~1.25초 | 이전 가격 → 얇은 화살표 sweep → 현재 가격 등장 |
| 1.25~1.95초 | 금액/비율 chip이 작은 시간차로 등장 |
| 1.95~2.5초 | 모든 모션이 끝난 최종 상태 유지 |

현재 가격의 scale 변화는 0.985→1.0에 한정합니다. bounce, zoom, shake, pulse를 사용하지 않습니다. 모션은 `frame / fps` 기준이며 30/60fps에서 동일한 길이를 유지합니다.

## 8. Global Theme / Component Adapter / Core

```text
src/design/themes/
  types.ts                        # GlobalTheme / ThemeName / ThemeRegistryEntry
  techDynamic.ts                  # Kit 전체의 공통 디자인 언어
  registry.ts                     # 구현/예정 상태와 전역 선택
  index.ts                        # 새 Component용 canonical API
src/components/PriceChangeCard/
  PriceChangeCard.tsx              # 기존 facade (변경 없음)
  core/PriceChangeCardCore.tsx     # 기존 layout·geometry·motion (변경 없음)
  input.ts, types.ts, metadata.ts  # 기존 external input 및 검증 (변경 없음)
  timing.ts                       # 기존 모션 (변경 없음)
  theme/
    types.ts                      # GlobalTheme + PriceChangeCard 전용 계약
    adapter.ts                    # 전역 언어 → PriceChangeCard 전용 토큰
    appearance.ts                 # component visual slot 매핑
    index.ts                      # 전역 선택과 adapter 연결
  themes/                         # 기존 네 파일의 호환 re-export
src/design/themes.ts              # 기존 PriceChangeCard import 호환 파일
```

**전역 책임:** background/depth, surface/layer, text/accent/방향 색상, border/edge highlight, control surface/layer/border/shadow, glow/shadow, panel/control/pill 기본 radius, fontFamily입니다. `GlobalTheme`는 Component와 React에 의존하지 않으며 PriceChangeCard의 가격 글자 크기·arrow·spacing·appearance를 포함하지 않습니다. 기존 chip 표면 값을 재사용 가능한 control 표면으로 명명했습니다.

**PriceChangeCard adapter 책임:** price/oldPrice/delta 및 title/meta/source의 글자 크기, 글자 weight/line-height, arrow stroke, PriceChangeCard spacing, component appearance slot, 글로벌 control 표면→chip 표면 및 radius 매핑입니다. Price-flow column과 chip geometry는 기존 Core에 그대로 남습니다.

흐름은 **input → facade → Global Theme registry → PriceChangeCard adapter → Core → Render**입니다. Core 파일을 재작성하지 않았으며 Core가 테마 이름이나 구현/예정 상태를 선택하지 않습니다. 전역 토큰은 immutable 계약이며 adapter는 전역 객체별로 결과를 재사용합니다.

### 전역 Theme Registry

```ts
import {getGlobalTheme, themeRegistry} from './src/design/themes/registry';
import type {ThemeName} from './src/design/themes/types';

const language = getGlobalTheme('techDynamic');
// language.accent / language.surface / language.fontFamily 등 공통 토큰
// themeRegistry에는 techDynamic(implemented), premiumMinimal/valuePop(planned)가 있습니다.
```

premiumMinimal과 valuePop은 이름과 planned 상태만 등록했습니다. 빈 디자인이나 techDynamic fallback을 넣지 않았습니다. 미구현 이름을 선택하면 `Unsupported theme: <name> (not implemented)`, 알 수 없는 이름은 `Unsupported theme: <name>` 오류가 납니다. PriceChangeCard를 통해 선택해도 동일하게 차단합니다.

기존 `src/design/themes.ts`의 getTheme/themes/ThemeTokens와 `PriceChangeCard/themes/*` import는 resolved PriceChangeCard adapter를 반환하는 호환 API로 유지합니다. **새 Component는 전역 `src/design/themes/registry` 또는 `src/design/themes/index`를 import하세요.** 기존 파일과 새 디렉터리가 함께 있으므로 경로를 명시하면 호환 파일을 잘못 선택하지 않습니다.

### 후속 Component와 Theme 추가

SectionIntro, Timeline 등은 후속 작업에서 각자의 Core와 appearance adapter를 만들고 `getGlobalTheme(themeName)`의 결과를 자신의 adapter에 전달하면 됩니다. 색상·폰트·표면·radius 기본값을 복사하지 않고 전역 객체를 사용하며, 자신의 글자 크기·geometry·spacing·slot은 Component 내부에서 정의합니다. 이번 작업에서 후속 Component나 Control Panel/Variant는 구현하지 않았습니다.

premiumMinimal/valuePop을 실제 구현할 때는 `src/design/themes/<name>.ts`에 **GlobalTheme 값만** 정의하고, `registry.ts`의 해당 planned 항목을 `{status: 'implemented', tokens: ...}`로 교체합니다. `globalThemes`는 registry에서 구현된 항목만 자동으로 추출하므로 별도 목록을 수정하지 않습니다. PriceChangeCard의 `getTheme()`는 전역 선택 결과를 기존 adapter에 전달하므로 이름별 색상 복사나 새로운 Core가 필요 없습니다. Component 전용 표현을 더 추가할 때만 해당 Component adapter와 appearance를 확장하세요.

## 9. v0.3 보존과 시각 회귀 검증

비교 기준은 `feature/price-change-card-v0.3-core-theme`의 `4ff6818d6ac1ea501ea0442804e70f11e510ea81` 커밋입니다. 원본 브랜치를 유지하고 `feature/global-shared-theme-v0.1`에서 작업합니다. PriceChangeCard Core, public/canonical/legacy input, sample, Root, timing, renderFps/transparent, 렌더 스크립트와 기존 9개 테스트 파일은 그대로 유지합니다.

```bash
npm run typecheck
npm test
npm start
npm run render:png
npm run render:mp4
npm run render:mp4 -- --fps 60 --output out/price-change-60.mp4
npm run render:png -- --transparent --output out/overlay.png
```

새 input 파일과 기존 sample 파일의 `--props` 사용법도 동일합니다. 이전 테스트에 추가해 전역 토큰 경계, planned/unknown theme 오류, 전역 토큰 변경의 adapter 반영, 기존 import/adapter 객체 호환성을 검증합니다.

마이그레이션 전 동일 머신에서 생성한 v0.3 S26 Ultra + techDynamic을 기준으로 final-frame PNG, 투명 PNG의 RGBA 픽셀과 30/60fps 영상의 전체 decoded frame hash를 비교합니다. 1920×1080·2.5초·H.264/yuv420p/BT.709를 유지합니다. 동일 환경 검증에서 30fps 75프레임·60fps 150프레임과 일반/투명 PNG의 RGBA 픽셀이 모두 v0.3과 정확히 일치했습니다. 타입 검사, 테스트 13개, Studio 실제 재생도 통과했습니다. 비교용 파일은 ignored out/에 보관하고 GitHub에 포함하지 않습니다.

## 사용 시 참고

Remotion을 기업/상업 작업에서 사용할 때는 팀 규모와 용도에 맞는 현재 라이선스 조건을 확인하세요: https://www.remotion.dev/license
