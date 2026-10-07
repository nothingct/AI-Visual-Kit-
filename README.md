# IT Visual Kit v0.2.1

YouTube IT 콘텐츠에서 반복해서 사용할 React + Remotion + TypeScript 영상용 그래픽 키트입니다. v0.2.1에는 **PriceChangeCard 하나만** 구현되어 있습니다. 기본 출력은 **1920×1080 / 30fps / 2.5초**이며, PNG 스틸과 H.264 MP4를 CapCut에 바로 가져올 수 있습니다.

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

## 3. PriceChangeCard 데이터 변경

기본 데이터는 `src/data/price-change.sample.json`에 있습니다. 아래 값은 사용자가 제공한 **샘플**이며, 실제 가격이나 출처 내용을 검증한 데이터가 아닙니다. 게시 전에 확인하세요.

```json
{
  "productName": "Galaxy S26 Ultra 256GB",
  "oldPrice": "1,797,400원",
  "newPrice": "1,947,000원",
  "delta": "+149,600원",
  "deltaPercent": "+8.3%",
  "dateLabel": "2026.03 → 2026.10",
  "priceType": "공식 출고가",
  "sourceLabel": "Samsung Korea",
  "direction": "up"
}
```

가격과 증감은 **표시 문자열**입니다. 통화, 쉼표, 부호를 포함해 입력하세요. `delta`와 `deltaPercent`는 자동 계산하지 않으므로 가격과 일치하는 값을 제공해야 합니다. `direction`은 `up`, `down`, `neutral` 중 하나입니다. 색상뿐 아니라 ↑/↓/— 및 한글 라벨로 방향을 구분합니다.

Studio의 “Save default props”는 외부 JSON을 참조하는 이 구조를 자동 수정하지 못합니다. 데이터 변경은 샘플 JSON 파일 편집 또는 `--props` 입력으로 적용하세요.

다른 JSON 파일을 사용할 수도 있습니다. 경로는 명령을 실행한 디렉터리를 기준으로 해석되며, 생략한 필드는 기본 샘플 값이 사용됩니다. 일관된 데이터를 위해 제품별 파일에는 위 9개 필드를 모두 입력하는 것을 권장합니다.

```bash
npm run studio -- --props=./src/data/price-change.sample.json
npm run render:mp4 -- --props ./src/data/price-change.sample.json
npm run render:png -- --props ./src/data/price-change.sample.json
```

`theme`는 선택 prop이며 기본값은 `"techDynamic"`입니다. 기존 9개 데이터 필드만 있는 JSON도 그대로 동작합니다. 지금은 techDynamic만 구현되어 있으며 premiumMinimal/valuePop 등 미구현 테마를 지정하면 오류가 표시됩니다. 별도 JSON에 `"theme": "techDynamic"`을 추가해 명시할 수 있습니다.

보조 렌더 옵션은 `renderFps: 30 | 60`, `transparent: boolean`입니다. Preview에서 60fps를 보려면 별도 JSON에 `"renderFps": 60`을 추가하고 `--props`로 읽습니다. 값이 비어 있거나 유효하지 않은 방향/FPS를 입력하면 렌더가 오류로 중단됩니다.

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

## 7. v0.2.1 techDynamic 디자인과 애니메이션

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

### 테마 구조와 확장

`src/design/themes.ts`의 `ThemeTokens` 계약에 background, backgroundDepth, surface, surfaceLayer, primaryText, secondaryText, accent, increase, decrease, neutral, border, edgeHighlight, chipSurface, chipLayer, chipBorder, chipShadow, glow, shadow, radius, spacing을 정의했습니다. `glow`는 외부 발광이 아니라 카드 내부의 매우 약한 edge 효과입니다.

`themes` 레지스트리와 `getTheme()`이 테마를 선택합니다. `PriceChangeTheme` 타입은 레지스트리 key에서 자동으로 생성됩니다. 테마를 생략하면 `defaultTheme = "techDynamic"`을 사용합니다. 방향 색상은 제품 브랜드와 독립적입니다. 폰트/해상도/모션 공통값은 `src/design/tokens.ts`에 유지합니다.

**premiumMinimal / valuePop 추가 방법:**

1. `src/design/themes.ts`의 `themes`에 해당 key와 `ThemeTokens`의 모든 값을 추가합니다. `satisfies Record<string, ThemeTokens>`가 필수 토큰 누락을 검사합니다.
2. 데이터 JSON에 `"theme": "premiumMinimal"` 또는 `"theme": "valuePop"`을 지정합니다. 타입과 런타임 선택은 레지스트리에 따라 자동 확장됩니다.
3. 기존 테마 테스트의 미구현 테마 오류 케이스를 새 테마의 성공 케이스로 바꾸고, PNG/MP4/투명 PNG와 축소 화면을 검증합니다.
4. 공통 글자 크기와 모션은 tokens.ts에서 조정합니다. 테마별 typography/motion이 필요해지면 ThemeTokens에 해당 계약을 추가하세요. 독립적인 새 컴포넌트를 만들 필요는 없습니다.

## 8. 구조와 향후 컴포넌트 추가

```text
src/
  index.ts                        # 폰트 및 Remotion 진입점
  remotion/Root.tsx                # Composition 등록
  design/tokens.ts                # 공통 해상도·글자 크기·모션
  design/themes.ts                # 테마 계약·레지스트리·기본 테마
  data/price-change.sample.json    # 제품 데이터
  components/PriceChangeCard/
    PriceChangeCard.tsx            # 유일한 그래픽 컴포넌트
    types.ts                      # 입력 타입
    timing.ts                     # 프레임 기반 모션
    metadata.ts                   # 입력 검증, FPS/길이 계산
scripts/render.mjs                # MP4 / PNG 렌더 명령
tests/price-change.test.ts        # 타이밍 및 입력 검증 테스트
remotion.config.ts                # Studio/CLI 브라우저 설정
```

향후 SpecCompare, Timeline, VerdictCard가 필요하면 `src/components/<이름>/`에 구현하고, props/data를 분리한 후 `src/remotion/Root.tsx`에 고유 ID의 Composition을 등록하세요. 디자인 토큰을 재사용하고 FPS에 따라 길이를 계산하는 `calculateMetadata`를 지정하세요. `scripts/render.mjs`는 v0.2.1에서 PriceChangeCard 전용이므로, 다른 컴포넌트를 추가하는 단계에서 Composition ID 옵션을 확장하면 됩니다. 이번 버전에는 다른 그래픽 컴포넌트를 포함하지 않습니다.

## v0.2.1 검증

v0.2의 5개 테스트와 2.5초 모션을 그대로 유지합니다. v0.2.1은 색상과 표면 표현만 다듬었으며 가격 크기·레이아웃·props·테마 기본값·샘플 데이터·FPS·렌더 명령을 유지합니다. 테마를 생략해도 techDynamic이 적용됩니다.

```bash
npm run typecheck
npm test
npm run render:png
npm run render:png -- --transparent --output out/overlay.png
npm run render:mp4
npm run render:mp4 -- --fps 60 --output out/price-change-60.mp4
```

## 사용 시 참고

Remotion을 기업/상업 작업에서 사용할 때는 팀 규모와 용도에 맞는 현재 라이선스 조건을 확인하세요: https://www.remotion.dev/license
