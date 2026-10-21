/**
 * The Matemind mark (docs/brand/BRAND.md, "split sail"): a sail cut into three bands — the work
 * split up — on one bar, the bottom line. The sail takes the text colour; the bar the brand accent.
 */
export function MatemindMark(props: { className?: string; mono?: boolean }) {
    return (
        <svg viewBox="0 0 64 64" className={props.className} aria-hidden="true">
            <path fill="currentColor" d="M44 4V16H34.73ZM44 20V32H22.36L31.64 20ZM44 36V48H10L19.27 36Z" />
            <rect x="8" y="52" width="48" height="8" rx="4" fill={props.mono ? 'currentColor' : 'var(--brand-accent)'} />
        </svg>
    )
}
