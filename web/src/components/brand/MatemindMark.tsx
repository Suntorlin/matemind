import { useId } from 'react'
import { MARK_FULL, MARK_SMALL } from './matemindMarkPaths'

/**
 * The Matemind mark (docs/brand/BRAND.md section 6): three curved ink-brush strokes form a sail full of
 * wind; one sunset swash under it is the bottom line. The sail takes the text colour. Sizes up to
 * 40 px use the small drawing (no dry-brush streaks). `mono` draws the swash in the text colour too.
 */
export function MatemindMark(props: { className?: string; mono?: boolean; small?: boolean }) {
    const id = useId()
    const mark = props.small ? MARK_SMALL : MARK_FULL
    const streaks = mark.streaks as readonly string[]
    return (
        <svg viewBox="0 0 64 64" className={props.className} aria-hidden="true">
            <defs>
                {props.mono ? null : (
                    <linearGradient id={`${id}g`} x1="5" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
                        {[0, 1, 2].map((stop) => (
                            <stop key={stop} offset={stop / 2} style={{ stopColor: `var(--brand-bar-${stop})` }} />
                        ))}
                    </linearGradient>
                )}
                {streaks.length > 0 ? (
                    <mask id={`${id}m`}>
                        <rect width="64" height="64" fill="#fff" />
                        {streaks.map((d) => <path key={d} d={d} fill="#000" />)}
                    </mask>
                ) : null}
            </defs>
            <g mask={streaks.length > 0 ? `url(#${id}m)` : undefined}>
                <g fill="currentColor">
                    {mark.sail.map((d) => <path key={d} d={d} />)}
                </g>
                <path d={mark.swash} fill={props.mono ? 'currentColor' : `url(#${id}g)`} />
            </g>
        </svg>
    )
}
