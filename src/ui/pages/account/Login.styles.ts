// Tailwind classes for AccountActivate.tsx, AccountLayout.tsx, AccountPassword.tsx, AccountReset.tsx, ActivateAccount.tsx, ResetPassword.tsx.
const styles = {
  // ───────────────────────────────────────────────────────── NALAR — Login Page Styling Accurate styling to reference image: - Split clean modern canvas - Floating organic branding and welcoming headline - Modern inputs with right adornment icons - Warm orange CTA button and Google sign-in - Majestic Nala mascot hero stage with Socratic shield ─────────────────────────────────────────────────────────
  page: 'min-h-svh grid relative overflow-x-hidden grid-cols-[1fr] [background:var(--color-canvas,#FAFAF7)] [font-family:var(--font-ui,_"Plus_Jakarta_Sans",_sans-serif)] [color:var(--color-ink,#15213B)] [@media(min-width:1200px)]:grid-cols-[46%_54%] [@media(min-width:960px)_and_(width_<_1200px)]:grid-cols-[1fr_1fr]',
  skip: 'px-4 py-2.5 top-4 left-4 bg-[#FFFFFF] absolute no-underline z-100 [color:var(--color-primary,#2447D1)] font-bold rounded-[8px] [box-shadow:0_4px_14px_rgba(0,0,0,0.15)] [transform:translateY(-160%)] [transition:transform_200ms_ease] focus:[transform:translateY(0)]',
  srOnly: '-m-px p-0 w-px h-px border-none overflow-hidden absolute whitespace-nowrap [clip-path:inset(50%)]',
  // ═════════════════════════════════════════════════════════ LEFT COLUMN: AUTH FORM CONTAINER ═════════════════════════════════════════════════════════
  account: 'px-5 py-6 min-h-svh flex relative flex-col justify-between [background:var(--color-canvas,#FAFAF7)] z-2 sm:px-12 sm:py-9 lg:px-16 lg:py-11 xl:px-21 xl:py-12',
  // ── Top Bar with Brand & Back Link ──
  topBar: 'mx-auto mt-0 mb-6 w-full max-w-100 flex items-center justify-between',
  brand: 'gap-2.5 inline-flex items-center select-none no-underline [color:var(--color-ink,#15213B)] text-[1.45rem] font-extrabold tracking-[-0.04em] [transition:transform_200ms_ease] hover:[transform:scale(1.02)]',
  brandDot: '[color:var(--color-primary,#2447D1)]',
  backBtn: 'px-3.5 py-1.5 gap-1.5 border [border-color:var(--color-border,#E4E0D7)] inline-flex items-center no-underline rounded-[999px] [background:var(--color-surface,#FFFFFF)] [color:var(--color-text-secondary,#4D5566)] text-[0.8125rem] font-semibold [transition:all_180ms_ease] [&_svg]:[color:var(--color-text-secondary,#4D5566)] [&_svg]:[transition:transform_180ms_ease] hover:border-[rgba(36,71,209,0.25)] hover:[background:var(--color-info-bg,#E7ECFB)] hover:[color:var(--color-primary,#2447D1)] [&:hover_svg]:[transform:translateX(-2px)] [&:hover_svg]:[color:var(--color-primary,#2447D1)]',
  // ── Form Area (Centered with Generous Whitespace) ──
  formArea: 'px-0 pt-3 pb-6 flex-1 flex items-center justify-center',
  content: 'w-full max-w-100',
  // ── Card Header (Hello Welcome to Nalar) ──
  cardHeader: 'mb-7',
  title: 'm-0 text-[clamp(2rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.035em] [color:var(--color-ink,#15213B)] leading-[1.15]',
  titleSub: '[color:var(--color-ink,#15213B)] font-extrabold',
  titleAccent: '[color:var(--color-primary,#2447D1)]',
  subtitle: 'mx-0 mt-3 mb-0 text-[0.9375rem] [color:var(--color-text-secondary,#4D5566)] leading-[1.55] font-normal',
  // ── Form Fields ──
  fields: 'm-0 p-0 gap-4.5 min-w-0 border-none grid',
  // Input Right End Adornment (@ and Lock)
  inputAdornmentIcon: 'flex items-center justify-center pointer-events-none [color:var(--color-control-border,#818795)] text-[1rem] font-semibold',
  // ── Submit Button: Nalar Cobalt Pill CTA ──
  submitBtn: 'mt-2.5! w-full! h-12! min-h-12! border-none! inline-flex! items-center! justify-center! cursor-pointer! rounded-[999px]! [background:var(--color-primary,#2447D1)]! text-[#FFFFFF]! text-[0.95rem]! font-bold! tracking-[-0.01em]! [box-shadow:0_8px_24px_rgba(36,71,209,0.28)]! [transition:all_250ms_cubic-bezier(0.34,1.56,0.64,1)]! hover:not-disabled:[background:var(--color-primary-hover,#1B38AB)]! hover:not-disabled:[transform:translateY(-2px)_scale(1.01)]! hover:not-disabled:[box-shadow:0_12px_28px_rgba(36,71,209,0.38)]! active:not-disabled:[transform:translateY(0)]! disabled:cursor-not-allowed! disabled:opacity-60! disabled:[box-shadow:none]!',
  // ── Help text below submit button ──
  help: 'mx-0 mt-6 mb-0 text-center text-[0.8125rem] leading-[1.55] [color:var(--color-text-secondary,#4D5566)]',
  // ── Session Check / Sign In Actions ──
  sessionAction: 'mt-5 px-5 py-3 w-full rounded-[12px] font-bold',
  error: 'mb-5',
  locale: 'font-medium',
  secureBadge: 'gap-1.5 inline-flex items-center [color:var(--color-success-strong,#185D46)] font-semibold',
  // ═════════════════════════════════════════════════════════ RIGHT COLUMN: NALA HERO MASCOT STAGE ═════════════════════════════════════════════════════════
  illustration: 'min-h-svh overflow-hidden hidden relative [background:var(--color-canvas,#FAFAF7)] [@media(min-width:960px)]:p-0 [@media(min-width:960px)]:flex [@media(min-width:960px)]:items-center [@media(min-width:960px)]:justify-center',
} satisfies Record<string, string>

export default styles
