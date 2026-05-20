/**
 * Greek key (meander) border strip.
 *
 * Pass a unique `id` per usage site — SVG pattern IDs are document-global,
 * so two instances with the same ID would share (and clobber) each other's stroke color.
 *
 * Path M0,8 V4 H4 V0 H12 V4 H8 V8 H16 tiles into the classic interlocking
 * rectangular-spiral pattern when repeated every 16 px horizontally.
 */
const GreekMeander = ({
  id,
  strokeColor,
  height = 10,
}: {
  id: string;
  strokeColor: string;
  height?: number;
}) => (
  <svg width="100%" height={height} style={{ display: 'block' }}>
    <defs>
      <pattern id={id} x="0" y="1" width="16" height="8" patternUnits="userSpaceOnUse">
        <path
          d="M0,8 V4 H4 V0 H12 V4 H8 V8 H16"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </pattern>
    </defs>
    <rect width="100%" height={height} fill={`url(#${id})`} />
  </svg>
);

export default GreekMeander;