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

/* Palette — shared with AuthIllustrations so the app feels of one piece. */
const HALO = "#EAF3FB";
const HALO_RING = "#D6E8F8";
const DOT = "#BBD8F1";
const GREEN = "#22C55E";

/* Soft halo + floating dots, identical motif to the auth illustrations. */
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

/* Empty shipments — a parked delivery truck waiting for its next load. */
export const EmptyShipmentsIllustration: React.FC<Props> = ({ size = 168 }) => (
    <Svg width={size} height={size} viewBox="0 0 160 160">
        <Defs>
            <LinearGradient id="truckBox" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1184CE" />
                <Stop offset="1" stopColor="#036BB4" />
            </LinearGradient>
        </Defs>

        <Halo />

        {/* ground shadow */}
        <Rect x={36} y={108} width={88} height={6} rx={3} fill="#036BB4" opacity={0.08} />

        {/* cargo box */}
        <Rect x={40} y={62} width={50} height={42} rx={6} fill="url(#truckBox)" />
        {/* box highlight */}
        <Rect x={46} y={68} width={12} height={30} rx={4} fill="#FFFFFF" opacity={0.14} />

        {/* cab */}
        <Path
            d="M90 74 h16 l12 14 v16 h-28 Z"
            fill="#0A4E80"
        />
        {/* windshield */}
        <Path d="M94 78 h10 l7 9 h-17 Z" fill="#EAF3FB" />

        {/* wheels */}
        <Circle cx={58} cy={106} r={9} fill="#1A1C1E" />
        <Circle cx={58} cy={106} r={3.5} fill="#FFFFFF" />
        <Circle cx={104} cy={106} r={9} fill="#1A1C1E" />
        <Circle cx={104} cy={106} r={3.5} fill="#FFFFFF" />

        {/* "waiting" badge — a small clock, signalling next-load is on its way */}
        <G>
            <Circle cx={108} cy={58} r={15} fill="#FFFFFF" />
            <Circle cx={108} cy={58} r={12} fill={GREEN} />
            <Path
                d="M108 52 v6 l4 3"
                stroke="#FFFFFF"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </G>
    </Svg>
);
