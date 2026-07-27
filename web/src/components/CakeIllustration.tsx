export type CakeVariant =
  | "slice-berry"
  | "slice-choc"
  | "whole-berry"
  | "tart"
  | "slice-red-velvet"
  | "slice-caramel"
  | "whole-vanilla"
  | "whole-citrus"
  | "cupcake"
  | "cookie"
  | "tiered-logo"
  | "tiered-wedding"
  | "hero";

const palette = {
  cream: "#FFF6EC",
  sponge: "#E9C9A6",
  spongeDark: "#D9AE80",
  choc: "#6B3A2F",
  chocDark: "#4E2A21",
  berry: "#D9636B",
  berryDark: "#B8434B",
  pink: "#F0A6AE",
  caramel: "#C98A3B",
  citrus: "#E9B94B",
  plate: "#F7F1EA",
  plateShadow: "#D8C9BA",
  mint: "#8FAE8B",
};

function Plate({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      <ellipse cx="100" cy="150" rx="78" ry="16" fill={palette.plateShadow} opacity="0.5" />
      <ellipse cx="100" cy="144" rx="86" ry="20" fill={palette.plate} />
      <ellipse cx="100" cy="140" rx="70" ry="14" fill={palette.plateShadow} opacity="0.35" />
      {children}
    </svg>
  );
}

export default function CakeIllustration({
  variant,
  className,
}: {
  variant: CakeVariant;
  className?: string;
}) {
  return <div className={className}>{render(variant)}</div>;
}

function render(variant: CakeVariant) {
  switch (variant) {
    case "slice-berry":
      return (
        <Plate>
          <path d="M60 130 L100 45 L140 130 Z" fill={palette.sponge} />
          <path d="M64 130 L100 55 L136 130 Z" fill={palette.cream} opacity="0.5" />
          <rect x="60" y="108" width="80" height="10" fill={palette.spongeDark} />
          <rect x="60" y="82" width="80" height="8" fill={palette.pink} />
          <circle cx="100" cy="50" r="7" fill={palette.berry} />
          <circle cx="112" cy="60" r="6" fill={palette.berryDark} />
          <circle cx="90" cy="60" r="5" fill={palette.berry} />
        </Plate>
      );
    case "slice-choc":
      return (
        <Plate>
          <path d="M58 132 L100 42 L142 132 Z" fill={palette.chocDark} />
          <rect x="58" y="106" width="84" height="9" fill={palette.choc} />
          <rect x="58" y="80" width="84" height="9" fill={palette.chocDark} />
          <path d="M92 46 q8 -14 16 0 q6 10 -4 14 q-14 4 -12 -14" fill={palette.choc} />
        </Plate>
      );
    case "whole-berry":
      return (
        <Plate>
          <ellipse cx="100" cy="118" rx="52" ry="16" fill={palette.spongeDark} />
          <rect x="48" y="72" width="104" height="46" rx="8" fill={palette.cream} />
          <ellipse cx="100" cy="72" rx="52" ry="14" fill={palette.pink} />
          <circle cx="80" cy="66" r="6" fill={palette.berry} />
          <circle cx="100" cy="60" r="7" fill={palette.berryDark} />
          <circle cx="120" cy="66" r="6" fill={palette.berry} />
        </Plate>
      );
    case "tart":
      return (
        <Plate>
          <circle cx="100" cy="100" r="46" fill={palette.spongeDark} />
          <circle cx="100" cy="96" r="40" fill={palette.cream} />
          <circle cx="86" cy="86" r="7" fill={palette.berry} />
          <circle cx="108" cy="90" r="6" fill={palette.mint} />
          <circle cx="98" cy="106" r="7" fill={palette.berryDark} />
          <circle cx="116" cy="106" r="6" fill={palette.pink} />
        </Plate>
      );
    case "slice-red-velvet":
      return (
        <Plate>
          <path d="M60 130 L100 45 L140 130 Z" fill="#9B2C3B" />
          <rect x="60" y="108" width="80" height="10" fill={palette.cream} />
          <rect x="60" y="82" width="80" height="8" fill="#7A1F2C" />
        </Plate>
      );
    case "slice-caramel":
      return (
        <Plate>
          <path d="M60 130 L100 45 L140 130 Z" fill={palette.caramel} />
          <path d="M60 128 Q100 100 140 128 L140 132 L60 132 Z" fill="#8A5A22" opacity="0.6" />
          <rect x="60" y="82" width="80" height="8" fill={palette.spongeDark} />
        </Plate>
      );
    case "whole-vanilla":
      return (
        <Plate>
          <ellipse cx="100" cy="118" rx="52" ry="16" fill={palette.spongeDark} />
          <rect x="48" y="72" width="104" height="46" rx="8" fill={palette.cream} />
          <ellipse cx="100" cy="72" rx="52" ry="14" fill={palette.cream} />
          <ellipse cx="100" cy="70" rx="30" ry="8" fill="#fff" opacity="0.6" />
        </Plate>
      );
    case "whole-citrus":
      return (
        <Plate>
          <ellipse cx="100" cy="118" rx="52" ry="16" fill={palette.spongeDark} />
          <rect x="48" y="72" width="104" height="46" rx="8" fill={palette.citrus} opacity="0.4" />
          <ellipse cx="100" cy="72" rx="52" ry="14" fill={palette.citrus} />
          <circle cx="100" cy="72" r="14" fill="#fff" opacity="0.5" />
        </Plate>
      );
    case "cupcake":
      return (
        <Plate>
          <path d="M70 120 L80 90 L120 90 L130 120 Z" fill={palette.spongeDark} />
          <path
            d="M65 90 Q100 40 135 90 Q120 100 100 90 Q80 100 65 90 Z"
            fill={palette.pink}
          />
          <circle cx="100" cy="52" r="6" fill={palette.berry} />
        </Plate>
      );
    case "cookie":
      return (
        <Plate>
          <circle cx="100" cy="98" r="44" fill={palette.spongeDark} />
          <circle cx="82" cy="86" r="6" fill={palette.chocDark} />
          <circle cx="112" cy="82" r="5" fill={palette.chocDark} />
          <circle cx="100" cy="104" r="6" fill={palette.chocDark} />
          <circle cx="120" cy="106" r="5" fill={palette.chocDark} />
          <circle cx="84" cy="112" r="5" fill={palette.chocDark} />
        </Plate>
      );
    case "tiered-logo":
      return (
        <Plate>
          <rect x="60" y="106" width="80" height="24" rx="4" fill={palette.cream} />
          <rect x="72" y="76" width="56" height="26" rx="4" fill={palette.sponge} />
          <rect x="84" y="52" width="32" height="20" rx="4" fill={palette.cream} />
          <rect x="88" y="86" width="24" height="10" rx="2" fill={palette.choc} />
        </Plate>
      );
    case "tiered-wedding":
      return (
        <Plate>
          <rect x="56" y="112" width="88" height="20" rx="4" fill="#fff" />
          <rect x="66" y="86" width="68" height="22" rx="4" fill="#fff" />
          <rect x="78" y="60" width="44" height="22" rx="4" fill="#fff" />
          <circle cx="100" cy="54" r="6" fill={palette.berry} />
          <circle cx="90" cy="86" r="3" fill={palette.pink} />
          <circle cx="112" cy="86" r="3" fill={palette.pink} />
          <circle cx="80" cy="112" r="3" fill={palette.pink} />
          <circle cx="120" cy="112" r="3" fill={palette.pink} />
        </Plate>
      );
    case "hero":
    default:
      return (
        <Plate>
          <path d="M55 132 L100 40 L145 132 Z" fill={palette.sponge} />
          <rect x="55" y="106" width="90" height="10" fill={palette.chocDark} />
          <rect x="55" y="80" width="90" height="9" fill={palette.pink} />
          <path
            d="M78 44 Q100 20 122 44 Q126 60 100 56 Q74 60 78 44 Z"
            fill={palette.cream}
          />
          <circle cx="70" cy="118" r="6" fill={palette.berry} />
          <circle cx="130" cy="122" r="6" fill={palette.berryDark} />
          <circle cx="80" cy="130" r="5" fill={palette.berry} />
        </Plate>
      );
  }
}
