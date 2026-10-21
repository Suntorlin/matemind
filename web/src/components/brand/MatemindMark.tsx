import { useId } from 'react'

const SAIL = 'M44 4V16H34.73ZM44 20V32H22.36L31.64 20ZM44 36V48H10L19.27 36Z'

/**
 * The Matemind mark (docs/brand/BRAND.md, "split sail"): a sail cut into three bands — the work
 * split up — on one bar, the bottom line. Filled with the live story-ring gradient; `mono` uses the text colour.
 */
export function MatemindMark(props: { className?: string; mono?: boolean }) {
    const id = useId()
    const fill = props.mono ? 'currentColor' : `url(#${id})`
    return (
        <svg viewBox="0 0 64 64" className={props.className} aria-hidden="true">
            {props.mono ? null : (
                <defs>
                    <linearGradient id={id} x1="6.4" y1="64" x2="48" y2="3.2" gradientUnits="userSpaceOnUse">
                        {[0, 1, 2, 3, 4].map((stop) => (
                            <stop key={stop} offset={stop / 4} style={{ stopColor: `var(--brand-sail-${stop})` }} />
                        ))}
                    </linearGradient>
                </defs>
            )}
            <path fill={fill} d={SAIL} />
            <rect x="8" y="52" width="48" height="8" rx="4" fill={fill} />
        </svg>
    )
}
