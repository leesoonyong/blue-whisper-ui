import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a56db 0%, #3182F6 60%, #60a5fa 100%)",
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 배경 원형 장식 */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            display: "flex",
          }}
        />

        {/* 집 아이콘 */}
        <div
          style={{
            fontSize: "96px",
            marginBottom: "24px",
            display: "flex",
          }}
        >
          🏠
        </div>

        {/* 앱 이름 */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "900",
            color: "white",
            letterSpacing: "-2px",
            marginBottom: "20px",
            display: "flex",
          }}
        >
          전월세 전환 계산기
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: "32px",
            color: "rgba(255,255,255,0.75)",
            fontWeight: "500",
            marginBottom: "40px",
            display: "flex",
          }}
        >
          나에게 맞는 보증금, DSR 기준으로 계산해보세요
        </div>

        {/* 태그 */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["전세 비교", "대출 계산", "적정 보증금"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: "100px",
                padding: "8px 20px",
                color: "white",
                fontSize: "22px",
                fontWeight: "600",
                display: "flex",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
