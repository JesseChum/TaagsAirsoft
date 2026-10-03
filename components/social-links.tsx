import { socials } from "@/lib/site";

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
} as const;

export function SocialLinks({ size = 20 }: { size?: number }) {
  return (
    <div className="flex items-center gap-1">
      <a href={socials.instagram} aria-label="Instagram" className="flex size-11 items-center justify-center">
        <svg width={size} height={size} {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" />
        </svg>
      </a>
      <a href={socials.youtube} aria-label="YouTube" className="flex size-11 items-center justify-center">
        <svg width={size + 2} height={size + 2} {...iconProps}>
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="M10 9l5 3-5 3z" />
        </svg>
      </a>
      <a href={socials.facebook} aria-label="Facebook" className="flex size-11 items-center justify-center">
        <svg width={size} height={size} {...iconProps}>
          <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V21" />
          <path d="M6 11h8" />
        </svg>
      </a>
    </div>
  );
}
