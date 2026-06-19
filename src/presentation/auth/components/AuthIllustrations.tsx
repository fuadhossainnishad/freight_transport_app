import React from "react";
import Svg, {
    Circle,
    Defs,
    G,
    LinearGradient,
    Path,
    Rect,
    Stop,
} from "react-native-svg";

interface Props {
    size?: number;
}

/* Palette ---------------------------------------------------------------- */
const HALO = "#EAF3FB";
const HALO_RING = "#D6E8F8";
const DOT = "#BBD8F1";
const BLUE_DARK = "#0A4E80";
const GREEN = "#22C55E";

/* Shared decorative background: soft halo + floating dots ----------------- */
const Halo = () => (
    <>
        <Circle cx={80} cy={80} r={74} fill={HALO} />
        <Circle cx={80} cy={80} r={74} stroke={HALO_RING} strokeWidth={2} fill="none" />
        <Circle cx={26} cy={46} r={5} fill={DOT} />
        <Circle cx={138} cy={58} r={4} fill={DOT} />
        <Circle cx={34} cy={122} r={4} fill={DOT} />
        <Circle cx={132} cy={120} r={6} fill={DOT} />
    </>
);

/* Forgot Password — padlock ---------------------------------------------- */
export const LockIllustration: React.FC<Props> = ({ size = 168 }) => (
    <Svg width={size} height={size} viewBox="0 0 160 160">
        <Defs>
            <LinearGradient id="lockBody" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1184CE" />
                <Stop offset="1" stopColor="#036BB4" />
            </LinearGradient>
        </Defs>

        <Halo />

        {/* shackle */}
        <Path
            d="M62 84 V68 a18 18 0 0 1 36 0 V84"
            stroke={BLUE_DARK}
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
        />

        {/* body */}
        <Rect x={48} y={82} width={64} height={52} rx={14} fill="url(#lockBody)" />
        {/* soft highlight */}
        <Rect x={56} y={90} width={18} height={36} rx={9} fill="#FFFFFF" opacity={0.12} />

        {/* keyhole */}
        <Circle cx={80} cy={102} r={8} fill="#FFFFFF" />
        <Path d="M77 107 h6 l-2 14 h-2 z" fill="#FFFFFF" />
    </Svg>
);

/* Verify Email — envelope with a verified check -------------------------- */
export const MailVerifyIllustration: React.FC<Props> = ({ size = 168 }) => (
    <Svg width={size} height={size} viewBox="0 0 160 160">
        <Defs>
            <LinearGradient id="mailBody" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1184CE" />
                <Stop offset="1" stopColor="#036BB4" />
            </LinearGradient>
        </Defs>

        <Halo />

        {/* envelope body */}
        <Rect x={42} y={56} width={76} height={56} rx={12} fill="url(#mailBody)" />
        {/* flap */}
        <Path
            d="M46 62 L80 88 L114 62"
            stroke="#FFFFFF"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.9}
        />
        {/* bottom fold highlight */}
        <Path
            d="M46 106 L70 86"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            opacity={0.18}
        />

        {/* verified badge */}
        <G>
            <Circle cx={114} cy={104} r={17} fill="#FFFFFF" />
            <Circle cx={114} cy={104} r={14} fill={GREEN} />
            <Path
                d="M107 104 l5 5 l9 -10"
                stroke="#FFFFFF"
                strokeWidth={3.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </G>
    </Svg>
);

/* Create New Password — security shield with keyhole -------------------- */
export const ShieldLockIllustration: React.FC<Props> = ({ size = 168 }) => (
    <Svg width={size} height={size} viewBox="0 0 160 160">
        <Defs>
            <LinearGradient id="shieldBody" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1184CE" />
                <Stop offset="1" stopColor="#036BB4" />
            </LinearGradient>
        </Defs>

        <Halo />

        {/* shield */}
        <Path
            d="M80 46 L114 59 V92 c0 24 -19 37 -34 43 c-15 -6 -34 -19 -34 -43 V59 Z"
            fill="url(#shieldBody)"
        />
        {/* highlight */}
        <Path
            d="M80 46 L80 135 C65 129 46 116 46 92 V59 Z"
            fill="#FFFFFF"
            opacity={0.1}
        />

        {/* keyhole */}
        <Circle cx={80} cy={86} r={9} fill="#FFFFFF" />
        <Path d="M76 91 h8 l-2.5 16 h-3 z" fill="#FFFFFF" />
    </Svg>
);
