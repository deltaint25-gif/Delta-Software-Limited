import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0b0b0c",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", marginBottom: 48 }}>
          <svg width="90" height="73" viewBox="65 95 447 362">
            <path
              transform="translate(0,554) scale(0.1,-0.1)"
              fill="#f5f5f4"
              stroke="none"
              d="M808 2853 c-2 -874 -1 -1605 3 -1627 9 -51 38 -88 80 -103 42 -15
2315 -18 2540 -3 81 5 190 19 244 31 495 107 905 431 1131 894 257 527 223
1139 -89 1618 -244 374 -615 626 -1072 728 -96 21 -125 23 -677 26 l-577 4 -3
-178 c-2 -98 -1 -182 1 -186 2 -5 168 -6 370 -2 416 8 708 -4 841 -34 503
-114 872 -494 975 -1006 25 -123 30 -302 12 -420 -89 -573 -505 -1001 -1067
-1097 -58 -10 -322 -13 -1152 -13 l-1077 0 -28 21 c-15 12 -37 36 -48 55 -19
33 -20 54 -22 784 -2 413 -3 1053 -3 1423 l0 672 -189 0 -188 0 -5 -1587z
M1570 3175 l0 -1265 913 4 c769 4 923 7 982 19 299 66 522 250 624 516 42 111
55 182 55 306 -2 409 -272 737 -684 830 -65 15 -159 18 -720 21 -717 5 -690 3
-737 73 -23 34 -23 37 -23 397 l0 364 -205 0 -205 0 0 -1265z m1740 35 c106
-14 165 -33 240 -78 131 -79 200 -202 200 -357 0 -245 -137 -423 -360 -466
-78 -15 -1004 -19 -1252 -5 l-158 8 0 454 0 454 628 0 c346 0 661 -5 702 -10z"
            />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#f5f5f4",
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "rgba(245,245,244,0.6)",
          }}
        >
          Custom Software, Designed to Perform.
        </div>
      </div>
    ),
    { ...size }
  );
}
