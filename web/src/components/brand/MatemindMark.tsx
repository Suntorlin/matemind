import { useId } from 'react'

const SAIL = 'M44 4V16H34.73ZM44 20V32H22.36L31.64 20ZM44 36V48H10L19.27 36Z'

/**
 * The Matemind mark (docs/brand/BRAND.md, "split sail"): a sail cut into three bands — the work
 * split up — on one bar, the bottom line. The sail takes the text colour; only the bar has colour,
 * a sunset gradient. `mono` draws the bar in the text colour too.
 */
export function MatemindMark(props: { className?: string; mono?: boolean }) {
    const id = useId()
    return (
        <svg viewBox="0 0 64 64" className={props.className} aria-hidden="true">
            {props.mono ? null : (
                <defs>
                    <linearGradient id={id} x1="8" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">
                        {[0, 1, 2].map((stop) => (
                            <stop key={stop} offset={stop / 2} style={{ stopColor: `var(--brand-bar-${stop})` }} />
                        ))}
                    </linearGradient>
                </defs>
            )}
            <path fill="currentColor" d={SAIL} />
            <rect x="8" y="52" width="48" height="8" rx="4" fill={props.mono ? 'currentColor' : `url(#${id})`} />
        </svg>
    )
}
