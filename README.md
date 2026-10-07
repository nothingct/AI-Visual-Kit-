# IT Visual Kit v0.3

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

## 8. Core / Theme / Input 구조

```text
src/components/PriceChangeCard/
  PriceChangeCard.tsx             # facade: 입력 정규화 + 테마 선택
  core/PriceChangeCardCore.tsx    # 정보 위계·배치·geometry·모션 적용
  timing.ts                      # 기존 프레임 기반 모션 (변경 없음)
  input.ts                       # canonical/legacy 정규화·입력 검증
  types.ts                       # 외부 input / legacy props / render 옵션 타입
  metadata.ts                    # 입력 검증 + FPS/길이 계산
  themes/
    types.ts                     # PriceChangeCardTheme / ThemeTokens 계약
    techDynamic.ts               # 유일하게 구현한 테마의 시각 값
    appearance.ts                # 테마 값 → 시각 style slot
    index.ts                     # registry / getTheme / defaultTheme
src/data/
  price-change.sample.json       # 기존 Preview 예시 (변경 없음)
  price-change.input.json        # 동일 S26 Ultra의 canonical input 예시
src/design/
  themes.ts                      # 기존 import 호환 re-export
  tokens.ts                      # 공통 canvas·typography 기본값·motion
src/remotion/Root.tsx             # 기존 Composition 등록 (변경 없음)
scripts/render.mjs               # 기존 MP4 / final-frame PNG 명령 (변경 없음)
```

흐름은 **props/input → normalizePriceChangeInput → getTheme → PriceChangeCardCore → Render**입니다. Core는 제품 데이터를 가져오거나 테마 이름을 선택하지 않습니다. 이미 정규화된 input과 구현된 `PriceChangeCardTheme` 객체를 받습니다. JSX의 정보 구조·위치·크기 맞춤·애니메이션은 Core가 담당하며, 색상·표면·border·shadow·radius·타이포그래피·화살표 선 스타일은 테마 계약과 style slot으로 분리했습니다. spacing은 기존 테마 토큰을 사용해 geometry를 계산합니다.

`PriceChangeCardTheme`에는 기존 색상·표면·radius·spacing 토큰과 typography, appearance, arrow 계약을 포함합니다. `VisualStyle`은 글자 시각 속성으로 제한해 layout/motion이 테마에 들어가지 않도록 합니다. 기존 `src/design/themes.ts`의 getTheme/ThemeTokens import는 re-export로 유지합니다.

향후 **premiumMinimal / valuePop**을 추가하려면:

1. `themes/`에 새 구현 파일을 만들고 `PriceChangeCardTheme` 계약을 충족하는 값만 정의합니다.
2. `themes/index.ts` 레지스트리에 해당 key를 등록합니다. 허용되는 theme 타입은 registry key에서 자동으로 확장됩니다.
3. 외부 input의 theme 값을 새 key로 바꿉니다. Core·입력 타입 필드·렌더 명령은 재작성할 필요가 없습니다.
4. 새로운 시각 속성이 필요할 때만 `themes/types.ts` 계약 및 `appearance.ts` slot 매핑을 확장합니다.

이번 버전에는 techDynamic만 실제 구현했습니다. 다른 그래픽 컴포넌트·Variant·Control Panel·InfoBadge/Caption 시스템은 추가하지 않았습니다.

## 9. v0.2.1 보존과 검증

비교 기준은 `feature/price-change-card-v0.2.1` 브랜치의 `c4d9de37c3978f8e24975f8dfb1069aa2f4e160e` 커밋입니다. 원본 브랜치를 수정/삭제하지 않고 `feature/price-change-card-v0.3-core-theme`에서 작업합니다. v0.3은 디자인 변경 없이 코드 경계만 분리합니다.

기존 5개 테스트는 그대로 유지하고 외부 input/legacy alias 우선순위·잘못된 canonical override·기존 theme import 호환성 회귀 검증을 추가했습니다.

```bash
npm run typecheck
npm test
npm run render:png
npm run render:mp4
npm run render:mp4 -- --fps 60 --output out/price-change-60.mp4
npm run render:png -- --transparent --output out/overlay.png
```

리팩터링 전 동일 머신에서 생성한 v0.2.1 영상과 v0.3의 canonical input 영상을 30/60fps 전체 프레임으로 비교합니다. 투명 PNG도 RGBA 픽셀을 비교합니다. 원본 영상/이미지는 ignored out/에 두며 GitHub에 포함하지 않습니다. 픽셀 일치는 검증한 Chromium·폰트·렌더 버전에서의 결과이며 다른 플랫폼의 폰트/브라우저 rasterization까지 보장하는 것은 아닙니다.

## 사용 시 참고

Remotion을 기업/상업 작업에서 사용할 때는 팀 규모와 용도에 맞는 현재 라이선스 조건을 확인하세요: https://www.remotion.dev/license
