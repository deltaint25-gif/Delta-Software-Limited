export type DeviceMockupVariant = "dashboard" | "mobile" | "analytics" | "storefront";

interface DeviceMockupProps {
  variant: DeviceMockupVariant;
  className?: string;
}

const INK = "#1f1f23";
const INK_GLOW = "#2c2c32";
const CHROME = "#26262b";
const CHROME_LIGHT = "#323238";
const PANEL = "#2a2a30";
const PANEL_DEEP = "#333339";
const LINE = "#3d3d45";
const MUTED = "#5c5c66";
const TEXT_DIM = "#7a7a84";
const TEXT = "#ececeb";
const RED = "#ef4136";
const RED_DEEP = "#8f241c";
const GREEN = "#34d399";
const YELLOW = "#f4d100";

const FONT = "Arial, Helvetica, sans-serif";

/** Diagonal glass-glare band, layered on top of a mockup to read as a photographed screen rather than a flat illustration. */
function GlassGlare() {
  return (
    <g opacity="0.5">
      <polygon points="0,0 160,0 50,224 0,224" fill="#ffffff" opacity="0.05" />
      <polygon points="185,0 235,0 125,224 75,224" fill="#ffffff" opacity="0.035" />
    </g>
  );
}

function Sparkline({
  x,
  y,
  w,
  h,
  points,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  points: number[];
  color: string;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(x + i * step).toFixed(1)},${(y + h - ((p - min) / range) * h).toFixed(1)}`)
    .join(" ");
  return <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
}

function TrendArrow({ x, y, up, color }: { x: number; y: number; up: boolean; color: string }) {
  return (
    <path
      d={up ? `M${x} ${y + 3}l3-3.5 3 3.5` : `M${x} ${y}l3 3.5 3-3.5`}
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

const ICONS = {
  box: (
    <>
      <rect x="-5" y="-3" width="10" height="8" rx="1.5" fill="none" stroke="#fff" strokeWidth="1.3" />
      <path d="M-5 -0.5h10M0 -3v8" stroke="#fff" strokeWidth="1.1" />
    </>
  ),
  alert: (
    <>
      <path d="M0 -5.5l5.5 9.5h-11z" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M0 -1.8v2.4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="0" cy="2.6" r="0.6" fill="#fff" />
    </>
  ),
  swap: (
    <>
      <path d="M-5 -1.5h8m0 0l-2.4-2.4M-5 -1.5l2.4 2.4" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 1.5h-8m0 0l2.4 2.4M5 1.5l-2.4-2.4" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  truck: (
    <>
      <rect x="-5.5" y="-3" width="7" height="6" rx="1" fill="none" stroke="#fff" strokeWidth="1.2" />
      <path d="M1.5 -1h2.7l1.8 2v2h-4.5z" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="-3" cy="3.6" r="1.1" fill="#fff" />
      <circle cx="3.3" cy="3.6" r="1.1" fill="#fff" />
    </>
  ),
  clock: (
    <>
      <circle cx="0" cy="0" r="5" fill="none" stroke="#fff" strokeWidth="1.3" />
      <path d="M0 -2.6v2.8h2.4" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="-5" y="-4" width="10" height="9" rx="1.4" fill="none" stroke="#fff" strokeWidth="1.2" />
      <path d="M-5 -1h10M-2.4 -5.4v2.2M2.4 -5.4v2.2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
};

function StatCard({
  x,
  y,
  w,
  h,
  iconBg,
  icon,
  label,
  value,
  delta,
  up,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  iconBg: string;
  icon: keyof typeof ICONS;
  label: string;
  value: string;
  delta: string;
  up: boolean;
}) {
  const deltaColor = up ? GREEN : RED;
  const spark = up ? [4, 6, 5, 8, 7, 10, 9, 12] : [12, 10, 11, 8, 9, 6, 7, 5];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="9" fill={PANEL} />
      <circle cx={x + 16} cy={y + 15} r="9.5" fill={iconBg} />
      <g transform={`translate(${x + 16},${y + 15})`}>{ICONS[icon]}</g>
      <text x={x + 30} y={y + 12.5} fontSize="6.2" fill={TEXT_DIM} fontFamily={FONT}>
        {label}
      </text>
      <text x={x + 30} y={y + 24} fontSize="12" fontWeight="700" fill={TEXT} fontFamily={FONT}>
        {value}
      </text>
      <TrendArrow x={x + 30} y={y + h - 10} up={up} color={deltaColor} />
      <text x={x + 37} y={y + h - 6.5} fontSize="6" fill={deltaColor} fontFamily={FONT}>
        {delta}
      </text>
      <g transform={`translate(0,0)`}>
        <Sparkline x={x + w - 42} y={y + h - 20} w={34} h={12} points={spark} color={deltaColor} />
      </g>
    </g>
  );
}

function AppChrome({ idPrefix, activeNav }: { idPrefix: string; activeNav: number }) {
  const navIcons: (keyof typeof ICONS)[] = ["box", "calendar", "clock", "swap", "alert"];
  return (
    <g>
      <defs>
        <radialGradient id={`${idPrefix}-glow`} cx="24%" cy="14%" r="90%">
          <stop offset="0%" stopColor={INK_GLOW} />
          <stop offset="100%" stopColor={INK} />
        </radialGradient>
        <linearGradient id={`${idPrefix}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CHROME_LIGHT} />
          <stop offset="100%" stopColor={CHROME} />
        </linearGradient>
        <radialGradient id={`${idPrefix}-dot`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="400" height="224" rx="14" fill={`url(#${idPrefix}-glow)`} />
      <rect x="0" y="0" width="400" height="34" rx="14" fill={`url(#${idPrefix}-bar)`} />
      <rect x="0" y="20" width="400" height="14" fill={`url(#${idPrefix}-bar)`} />
      <rect x="0" y="0" width="400" height="1" fill="#ffffff" fillOpacity="0.08" />
      {[16, 28, 40].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="17" r="3.6" fill={[RED, YELLOW, MUTED][i]} />
          <circle cx={cx} cy="17" r="3.6" fill={`url(#${idPrefix}-dot)`} />
        </g>
      ))}
      <rect x="150" y="10" width="120" height="14" rx="7" fill={PANEL} />
      <circle cx="160" cy="17" r="2.3" fill="none" stroke={TEXT_DIM} strokeWidth="1" />
      <rect x="166" y="16" width="26" height="2" rx="1" fill={TEXT_DIM} opacity="0.5" />
      <circle cx="366" cy="17" r="9" fill={PANEL} />
      <path d="M366 12.5a3.6 3.6 0 013.6 3.6v2l1.1 1.7h-9.4l1.1-1.7v-2a3.6 3.6 0 013.6-3.6z" fill="none" stroke={TEXT_DIM} strokeWidth="1" />
      <circle cx="371.5" cy="11.5" r="2.4" fill={RED} />

      {/* sidebar */}
      <rect x="0" y="34" width="46" height="190" fill={PANEL} />
      <rect x="12" y="46" width="22" height="22" rx="6" fill={RED} />
      <path d="M17 57h12M23 51v12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      {navIcons.map((name, i) => {
        const y = 88 + i * 27;
        const active = i === activeNav;
        return (
          <g key={i}>
            <rect x="12" y={y} width="22" height="22" rx="6" fill={active ? RED : PANEL_DEEP} />
            <g transform={`translate(23,${y + 11})`} opacity={active ? 1 : 0.6}>
              {ICONS[name]}
            </g>
          </g>
        );
      })}
    </g>
  );
}

function DashboardIllustration() {
  const points = [40, 58, 50, 70, 62, 82, 74, 96, 84, 92, 104, 118];
  const chartX = 58;
  const chartY = 104;
  const chartW = 216;
  const chartH = 110;
  const plotX0 = chartX + 12;
  const plotX1 = chartX + chartW - 12;
  const plotY0 = chartY + 30;
  const plotY1 = chartY + chartH - 20;
  const step = (plotX1 - plotX0) / (points.length - 1);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => [plotX0 + i * step, plotY1 - ((p - min) / range) * (plotY1 - plotY0)] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${plotX1},${plotY1} L${plotX0},${plotY1} Z`;
  const peak = coords[7];

  return (
    <svg viewBox="0 0 400 224" className="h-full w-full">
      <defs>
        <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RED} stopOpacity="0.35" />
          <stop offset="100%" stopColor={RED} stopOpacity="0" />
        </linearGradient>
      </defs>
      <AppChrome idPrefix="dash" activeNav={0} />

      <StatCard x={58} y={42} w={100} h={52} iconBg={GREEN} icon="box" label="In Stock" value="1,284" delta="+6.4%" up />
      <StatCard x={166} y={42} w={100} h={52} iconBg={RED} icon="alert" label="Low Stock" value="18" delta="+3 today" up={false} />
      <StatCard x={274} y={42} w={100} h={52} iconBg={YELLOW} icon="swap" label="Transfers" value="42" delta="+12%" up />

      {/* chart panel */}
      <rect x={chartX} y={chartY} width={chartW} height={chartH} rx="10" fill={PANEL} />
      <text x={chartX + 10} y={chartY + 16} fontSize="8.5" fontWeight="700" fill={TEXT} fontFamily={FONT}>
        Stock Movement
      </text>
      <rect x={chartX + chartW - 50} y={chartY + 8} width="42" height="14" rx="7" fill={PANEL_DEEP} />
      <text x={chartX + chartW - 29} y={chartY + 17.5} fontSize="6" fill={TEXT_DIM} fontFamily={FONT} textAnchor="middle">
        30 Days
      </text>

      <path d={area} fill="url(#dash-area)" stroke="none" />
      <path d={line} fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={peak[0]} cy={peak[1]} r="2.6" fill={RED} />
      <line x1={peak[0]} y1={peak[1]} x2={peak[0]} y2={plotY1} stroke={LINE} strokeWidth="1" strokeDasharray="2 2" />
      <rect x={peak[0] - 24} y={chartY + 24} width="48" height="16" rx="5" fill={PANEL_DEEP} stroke={LINE} strokeWidth="0.6" />
      <text x={peak[0]} y={chartY + 34.5} fontSize="6.5" fontWeight="700" fill={TEXT} fontFamily={FONT} textAnchor="middle">
        482 units
      </text>
      <text x={plotX0} y={chartY + chartH - 6} fontSize="5.8" fill={TEXT_DIM} fontFamily={FONT}>
        Week 1
      </text>
      <text x={plotX1} y={chartY + chartH - 6} fontSize="5.8" fill={TEXT_DIM} fontFamily={FONT} textAnchor="end">
        Week 6
      </text>

      {/* low stock list */}
      <rect x={282} y={chartY} width={92} height={chartH} rx="10" fill={PANEL} />
      <text x={292} y={chartY + 16} fontSize="7.5" fontWeight="700" fill={TEXT} fontFamily={FONT}>
        Low Stock
      </text>
      {[
        { name: "Wireless Mouse", qty: "4 left" },
        { name: "USB-C Cable", qty: "2 left" },
        { name: "Desk Lamp", qty: "6 left" },
      ].map((item, i) => {
        const y = chartY + 30 + i * 26;
        return (
          <g key={item.name}>
            <rect x={292} y={y} width="12" height="12" rx="3" fill={PANEL_DEEP} />
            <text x={308} y={y + 6.5} fontSize="6.3" fill={TEXT} fontFamily={FONT}>
              {item.name}
            </text>
            <text x={308} y={y + 15} fontSize="5.6" fill={TEXT_DIM} fontFamily={FONT}>
              {item.qty}
            </text>
          </g>
        );
      })}
      <GlassGlare />
    </svg>
  );
}

function MobileIllustration() {
  const px0 = 145;
  const pw = 110;
  const py0 = 10;
  const ph = 208;
  return (
    <svg viewBox="0 0 400 224" className="h-full w-full">
      <defs>
        <radialGradient id="mob-glow" cx="50%" cy="8%" r="95%">
          <stop offset="0%" stopColor={INK_GLOW} />
          <stop offset="100%" stopColor={INK} />
        </radialGradient>
        <linearGradient id="mob-frame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d3d45" />
          <stop offset="100%" stopColor={PANEL} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="224" rx="14" fill="url(#mob-glow)" />

      <rect x={px0} y={py0} width={pw} height={ph} rx="20" fill="url(#mob-frame)" stroke={LINE} strokeWidth="2" />
      <rect x={px0 - 2} y={py0 + 40} width="2" height="16" rx="1" fill={LINE} />
      <rect x={px0 - 2} y={py0 + 64} width="2" height="24" rx="1" fill={LINE} />
      <rect x={px0 + pw} y={py0 + 52} width="2" height="26" rx="1" fill={LINE} />
      <rect x={px0 + pw / 2 - 12} y={py0 + 6} width="24" height="5" rx="2.5" fill={LINE} />

      {/* status bar */}
      <text x={px0 + 12} y={py0 + 22} fontSize="6" fontWeight="700" fill={TEXT} fontFamily={FONT}>
        9:41
      </text>
      <rect x={px0 + pw - 30} y={py0 + 18} width="10" height="4.5" rx="1.5" fill="none" stroke={TEXT} strokeWidth="0.8" />
      <rect x={px0 + pw - 42} y={py0 + 18} width="8" height="4.5" rx="1.5" fill={TEXT} opacity="0.8" />

      {/* header */}
      <path d={`M${px0 + 12} ${py0 + 38}l-3.5 3.5 3.5 3.5`} fill="none" stroke={TEXT} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x={px0 + 22} y={py0 + 44} fontSize="8" fontWeight="700" fill={TEXT} fontFamily={FONT}>
        Appointments
      </text>
      <circle cx={px0 + pw - 14} cy={py0 + 41} r="7" fill={PANEL_DEEP} />
      <path d={`M${px0 + pw - 14} ${py0 + 37.5}a2.6 2.6 0 012.6 2.6v1.4l0.8 1.2h-6.8l0.8-1.2v-1.4a2.6 2.6 0 012.6-2.6z`} fill="none" stroke={TEXT_DIM} strokeWidth="0.8" />

      {/* segmented control */}
      <rect x={px0 + 10} y={py0 + 54} width={pw - 20} height="16" rx="8" fill={PANEL_DEEP} />
      <rect x={px0 + 10} y={py0 + 54} width={(pw - 20) / 2} height="16" rx="8" fill={RED} />
      <text x={px0 + 10 + (pw - 20) / 4} y={py0 + 64.5} fontSize="6" fontWeight="700" fill="#fff" fontFamily={FONT} textAnchor="middle">
        Upcoming
      </text>
      <text x={px0 + pw - 10 - (pw - 20) / 4} y={py0 + 64.5} fontSize="6" fill={TEXT_DIM} fontFamily={FONT} textAnchor="middle">
        Past
      </text>

      {/* appointment cards */}
      {[
        { name: "Dr. Alicia Reyes", specialty: "Cardiology", time: "3:30 PM", color: RED, status: "Confirmed", statusColor: GREEN },
        { name: "Dr. Marcus Lee", specialty: "Dermatology", time: "10:00 AM", color: YELLOW, status: "Pending", statusColor: YELLOW },
      ].map((appt, i) => {
        const y = py0 + 76 + i * 46;
        return (
          <g key={appt.name}>
            <rect x={px0 + 10} y={y} width={pw - 20} height="40" rx="8" fill={PANEL} />
            <circle cx={px0 + 24} cy={y + 18} r="9" fill={appt.color} opacity="0.85" />
            <text x={px0 + 24} y={y + 21} fontSize="7" fontWeight="700" fill="#fff" fontFamily={FONT} textAnchor="middle">
              {appt.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </text>
            <text x={px0 + 38} y={y + 15} fontSize="6.4" fontWeight="700" fill={TEXT} fontFamily={FONT}>
              {appt.name}
            </text>
            <text x={px0 + 38} y={y + 24} fontSize="5.4" fill={TEXT_DIM} fontFamily={FONT}>
              {appt.specialty}
            </text>
            <text x={px0 + 38} y={y + 35} fontSize="5" fill={TEXT_DIM} fontFamily={FONT}>
              {appt.time}
            </text>
            <rect x={px0 + pw - 44} y={y + 26} width="34" height="11" rx="5.5" fill={appt.statusColor} opacity="0.16" />
            <text x={px0 + pw - 27} y={y + 34} fontSize="5" fontWeight="700" fill={appt.statusColor} fontFamily={FONT} textAnchor="middle">
              {appt.status}
            </text>
          </g>
        );
      })}

      {/* floating CTA */}
      <rect x={px0 + 10} y={py0 + 166} width={pw - 20} height="18" rx="9" fill={RED} />
      <path d={`M${px0 + 24} ${py0 + 175}h7m-3.5 -3.5v7`} stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <text x={px0 + 40} y={py0 + 178.5} fontSize="6.5" fontWeight="700" fill="#fff" fontFamily={FONT}>
        New Booking
      </text>

      {/* tab bar */}
      <rect x={px0 + 14} y={py0 + ph - 22} width={pw - 28} height="14" rx="7" fill={PANEL_DEEP} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={px0 + 26 + i * 18} cy={py0 + ph - 15} r={i === 0 ? 3 : 2} fill={i === 0 ? RED : TEXT_DIM} />
      ))}
      <GlassGlare />
    </svg>
  );
}

function AnalyticsIllustration() {
  const bars = [
    { h: 30, label: "Rt A" },
    { h: 52, label: "Rt B" },
    { h: 74, label: "Rt C", accent: true },
    { h: 42, label: "Rt D" },
    { h: 60, label: "Rt E" },
    { h: 38, label: "Rt F" },
  ];
  const chartX = 58;
  const chartY = 104;
  const chartW = 216;
  const chartH = 110;
  const baseline = chartY + chartH - 22;
  const barW = 20;
  const gap = (chartW - 24 - barW * bars.length) / (bars.length - 1);

  const legend = [
    { label: "On-time", value: "94.2%", color: GREEN },
    { label: "Delayed", value: "4.6%", color: YELLOW },
    { label: "Cancelled", value: "1.2%", color: RED },
  ];

  return (
    <svg viewBox="0 0 400 224" className="h-full w-full">
      <defs>
        <linearGradient id="an-route-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RED} />
          <stop offset="100%" stopColor={RED} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="an-bar-muted" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={MUTED} />
          <stop offset="100%" stopColor={MUTED} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <AppChrome idPrefix="an" activeNav={2} />

      <StatCard x={58} y={42} w={100} h={52} iconBg={RED} icon="truck" label="Active" value="128" delta="+8.1%" up />
      <StatCard x={166} y={42} w={100} h={52} iconBg={GREEN} icon="clock" label="On-Time Rate" value="94.2%" delta="+2.1%" up />
      <StatCard x={274} y={42} w={100} h={52} iconBg={YELLOW} icon="alert" label="Delayed" value="6" delta="-3 today" up={false} />

      {/* bar chart */}
      <rect x={chartX} y={chartY} width={chartW} height={chartH} rx="10" fill={PANEL} />
      <text x={chartX + 10} y={chartY + 16} fontSize="8.5" fontWeight="700" fill={TEXT} fontFamily={FONT}>
        Deliveries by Route
      </text>
      {bars.map((bar, i) => {
        const x = chartX + 12 + i * (barW + gap);
        const y = baseline - bar.h * 0.62;
        const h = bar.h * 0.62;
        return (
          <g key={bar.label}>
            {bar.accent && (
              <>
                <rect x={x - 6} y={y - 16} width={barW + 12} height="14" rx="5" fill={PANEL_DEEP} stroke={LINE} strokeWidth="0.6" />
                <text x={x + barW / 2} y={y - 6} fontSize="6" fontWeight="700" fill={TEXT} fontFamily={FONT} textAnchor="middle">
                  42 today
                </text>
              </>
            )}
            <rect x={x} y={y} width={barW} height={h} rx="4" fill={bar.accent ? "url(#an-route-bar)" : "url(#an-bar-muted)"} />
            <text x={x + barW / 2} y={baseline + 10} fontSize="5.8" fill={TEXT_DIM} fontFamily={FONT} textAnchor="middle">
              {bar.label}
            </text>
          </g>
        );
      })}
      <line x1={chartX + 8} y1={baseline} x2={chartX + chartW - 8} y2={baseline} stroke={LINE} strokeWidth="1" />

      {/* donut + legend */}
      <rect x={282} y={chartY} width={92} height={chartH} rx="10" fill={PANEL} />
      <text x={292} y={chartY + 16} fontSize="7.5" fontWeight="700" fill={TEXT} fontFamily={FONT}>
        On-Time Rate
      </text>
      <circle cx={328} cy={chartY + 40} r="18" fill="none" stroke={LINE} strokeWidth="6" />
      <path d="M328 22a18 18 0 011.5 36" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" />
      <text x={328} y={chartY + 43} textAnchor="middle" fontSize="9" fill={TEXT} fontWeight="700" fontFamily={FONT}>
        94%
      </text>
      {legend.map((item, i) => {
        const y = chartY + 68 + i * 12;
        return (
          <g key={item.label}>
            <circle cx={292} cy={y - 2} r="2.6" fill={item.color} />
            <text x={299} y={y} fontSize="5.8" fill={TEXT_DIM} fontFamily={FONT}>
              {item.label}
            </text>
            <text x={374} y={y} fontSize="5.8" fontWeight="700" fill={TEXT} fontFamily={FONT} textAnchor="end">
              {item.value}
            </text>
          </g>
        );
      })}
      <GlassGlare />
    </svg>
  );
}

function StorefrontIllustration() {
  const products = [
    { name: "Canvas Tote", price: "$48", rating: 5 },
    { name: "Linen Shirt", price: "$76", rating: 4 },
    { name: "Suede Loafers", price: "$132", rating: 5 },
  ];

  return (
    <svg viewBox="0 0 400 224" className="h-full w-full">
      <defs>
        <linearGradient id="store-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={INK_GLOW} />
          <stop offset="100%" stopColor={INK} />
        </linearGradient>
        <linearGradient id="store-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CHROME_LIGHT} />
          <stop offset="100%" stopColor={CHROME} />
        </linearGradient>
        <radialGradient id="store-dot" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="store-banner" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={RED} stopOpacity="0.9" />
          <stop offset="100%" stopColor={RED_DEEP} stopOpacity="0.8" />
        </linearGradient>
        {products.map((_, i) => (
          <linearGradient key={i} id={`store-card-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={i === 1 ? RED : LINE} stopOpacity={i === 1 ? 0.55 : 1} />
            <stop offset="100%" stopColor={PANEL_DEEP} />
          </linearGradient>
        ))}
      </defs>

      <rect x="0" y="0" width="400" height="224" rx="14" fill="url(#store-glow)" />
      <rect x="0" y="0" width="400" height="34" rx="14" fill="url(#store-bar)" />
      <rect x="0" y="20" width="400" height="14" fill="url(#store-bar)" />
      <rect x="0" y="0" width="400" height="1" fill="#ffffff" fillOpacity="0.08" />
      {[16, 28, 40].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="17" r="3.6" fill={[RED, YELLOW, MUTED][i]} />
          <circle cx={cx} cy="17" r="3.6" fill="url(#store-dot)" />
        </g>
      ))}
      <text x="62" y="21.5" fontSize="8" fontWeight="700" fill={TEXT} fontFamily={FONT}>
        Aurel
      </text>
      {["Shop", "New", "Sale"].map((label, i) => (
        <text key={label} x={100 + i * 30} y="21.5" fontSize="6.5" fill={i === 2 ? RED : TEXT_DIM} fontFamily={FONT}>
          {label}
        </text>
      ))}
      <rect x="272" y="10" width="80" height="14" rx="7" fill={PANEL} />
      <circle cx="282" cy="17" r="2.3" fill="none" stroke={TEXT_DIM} strokeWidth="1" />
      <rect x="362" y="10" width="26" height="14" rx="7" fill={PANEL} />
      <path d="M370 14.5h1.4l0.8 5.4h5.6l1-4h-7.4" fill="none" stroke={TEXT_DIM} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="381" cy="12.5" r="4" fill={RED} />
      <text x="381" y="14.3" textAnchor="middle" fontSize="5.4" fill="#fff" fontWeight="700" fontFamily={FONT}>
        2
      </text>

      {/* hero banner */}
      <rect x="14" y="44" width="372" height="52" rx="10" fill="url(#store-banner)" />
      <rect x="30" y="54" width="34" height="10" rx="5" fill="#ffffff" fillOpacity="0.85" />
      <text x="35.5" y="61.5" fontSize="6" fontWeight="700" fill={RED_DEEP} fontFamily={FONT}>
        SALE
      </text>
      <text x="30" y="79" fontSize="12" fontWeight="700" fill="#fff" fontFamily={FONT}>
        New Season Arrivals
      </text>
      <text x="30" y="89" fontSize="6.5" fill="#ffffff" fillOpacity="0.85" fontFamily={FONT}>
        Fresh drops, up to 30% off
      </text>
      <rect x="320" y="66" width="52" height="16" rx="8" fill={INK} />
      <text x="346" y="76.5" fontSize="6.5" fontWeight="700" fill="#fff" fontFamily={FONT} textAnchor="middle">
        Shop Now
      </text>

      {/* filter row */}
      {["All", "Tops", "Shoes", "Accessories"].map((label, i) => {
        const x = 14 + i * 56;
        const active = i === 0;
        return (
          <g key={label}>
            <rect x={x} y="104" width="50" height="14" rx="7" fill={active ? RED : PANEL} />
            <text x={x + 25} y="113.5" fontSize="5.8" fill={active ? "#fff" : TEXT_DIM} fontFamily={FONT} textAnchor="middle">
              {label}
            </text>
          </g>
        );
      })}

      {/* product grid */}
      {products.map((product, i) => {
        const x = 14 + i * 126;
        return (
          <g key={product.name}>
            <rect x={x} y="126" width="114" height="82" rx="9" fill={PANEL} />
            <rect x={x + 8} y="134" width="98" height="42" rx="6" fill={`url(#store-card-${i})`} />
            <circle cx={x + 92} cy="146" r="8" fill={INK} fillOpacity="0.7" />
            <path
              d={`M${x + 92} 142.5c1.6-1.6 4-1.6 4 0.6 0 2-2.6 3.4-4 4.6-1.4-1.2-4-2.6-4-4.6 0-2.2 2.4-2.2 4-0.6z`}
              fill="none"
              stroke="#fff"
              strokeWidth="0.9"
            />
            <text x={x + 8} y="188" fontSize="6.8" fontWeight="700" fill={TEXT} fontFamily={FONT}>
              {product.name}
            </text>
            <text x={x + 8} y="198.5" fontSize="7.5" fontWeight="700" fill={RED} fontFamily={FONT}>
              {product.price}
            </text>
            {[0, 1, 2, 3, 4].map((s) => (
              <path
                key={s}
                d={`M${x + 60 + s * 8} 194l1.6 2.2h2.4l-2 1.6.8 2.4-2.4-1.6-2.4 1.6.8-2.4-2-1.6h2.4z`}
                fill={s < product.rating ? RED : LINE}
              />
            ))}
          </g>
        );
      })}
      <GlassGlare />
    </svg>
  );
}

const VARIANTS: Record<DeviceMockupVariant, () => JSX.Element> = {
  dashboard: DashboardIllustration,
  mobile: MobileIllustration,
  analytics: AnalyticsIllustration,
  storefront: StorefrontIllustration,
};

export default function DeviceMockup({ variant, className }: DeviceMockupProps) {
  const Illustration = VARIANTS[variant];
  return (
    <div className={className} aria-hidden="true">
      <Illustration />
    </div>
  );
}
