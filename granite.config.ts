import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "jeonse-calculator", // 한 번 등록 후 수정 불가
  brand: {
    displayName: "전월세 전환 계산기",
    primaryColor: "#3182F6", // 토스 블루
    icon: "", // 콘솔에서 앱 등록 후 업로드된 이미지 URL로 교체하세요
  },
  permissions: [], // 카메라/위치 등 불필요
  navigationBar: {
    withBackButton: true,
    withHomeButton: false,
  },
  web: {
    host: "localhost",
    port: 8080,
    commands: {
      dev: "vite",        // 번들러 커맨드 직접 입력 (npm run dev 아님)
      build: "vite build",
    },
  },
  webViewProps: {
    type: "partner",
    bounces: false,
    pullToRefreshEnabled: false,
  },
  outdir: "dist",
});
