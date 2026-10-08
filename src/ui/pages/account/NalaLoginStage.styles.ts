// Tailwind classes for NalaLoginStage.tsx.
// `nalaloginstage-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  // ───────────────────────────────────────────────────────── NALAR — NalaLoginStage Styles Faithful recreation of reference illustration with NALA's authentic identity ─────────────────────────────────────────────────────────
  stageContainer: 'w-full h-full min-h-svh overflow-hidden flex relative items-center justify-center select-none [background:var(--color-canvas,#FAFAF7)]',
  // ── Authentic NALAR Arch Watermark ──
  watermark: '-top-15 -right-22.5 w-145 h-145 absolute pointer-events-none opacity-6 text-[#FFFFFF]',
  // ── Deep Blue Wave with Digital Circuit on the Right (Partial Wave) ──
  blueNetworkWave: 'inset-y-0 right-0 w-[68%] h-full absolute pointer-events-none z-1',
  blueWaveSvg: 'w-full h-full object-cover',
  // Circuit line pulse animation
  circuitLine: '[stroke-dasharray:8_4] [animation:nalaloginstage-circuitFlow_18s_linear_infinite]',
  circuitNode: '[animation:nalaloginstage-nodeGlow_3s_ease-in-out_infinite_alternate]',
  // ── Center Stage Wrap: Spacious Open Full-Screen Stage (No Box) ──
  centerStage: 'px-5 py-6 w-full max-w-135 flex relative flex-col items-center justify-center z-2',
  // 1. Lightning Circle: Nalar Warm Amber Accent (#F2B23A)
  badgeLightning: 'top-2.5 right-10 w-13.5 h-13.5 border-[3.5px] border-[#FFFBEB] flex absolute items-center justify-center z-6 rounded-[50%] [background:radial-gradient(circle_at_35%_35%,#FEF3C7_0%,#F59E0B_60%,#D97706_100%)] [box-shadow:0_8px_24px_rgba(245,158,11,0.45),0_0_16px_rgba(251,191,36,0.4)] text-[#FFFFFF] [animation:nalaloginstage-floatLightning_4.5s_ease-in-out_infinite]',
  // 2. Folder with Papers (Top Left)
  badgeFolder: 'top-[75px] left-4 absolute z-5 [animation:nalaloginstage-floatFolder_5.2s_ease-in-out_infinite_0.6s] [filter:drop-shadow(0_12px_24px_rgba(36,71,209,0.35))]',
  // 3. Left Green Shield
  badgeShieldLeft: 'top-55 -left-2.5 absolute z-5 [animation:nalaloginstage-floatShieldLeft_4.8s_ease-in-out_infinite_1.2s] [filter:drop-shadow(0_12px_24px_rgba(16,185,129,0.4))]',
  // 4. Right Green Shield
  badgeShieldRight: 'top-45 right-0 absolute z-5 [animation:nalaloginstage-floatShieldRight_5s_ease-in-out_infinite_1.8s] [filter:drop-shadow(0_12px_24px_rgba(16,185,129,0.4))]',
  // 5. Bottom Left Plant
  badgePlant: 'bottom-[35px] left-7.5 absolute z-5 [animation:nalaloginstage-swayPlant_6s_ease-in-out_infinite] [transform-origin:bottom_center]',
  // ── Character / Mascot Area ──
  mascotStageWrap: 'nalaloginstage-mascotStageWrap flex relative flex-col items-center justify-center z-4',
  // 6. Glowing Blue Socratic Hero Shield (Matching Reference Image)
  badgeHeroShield: 'right-5 bottom-[25px] absolute z-6 [filter:drop-shadow(0_14px_28px_rgba(36,71,209,0.45))] [animation:nalaloginstage-floatHeroShield_4.6s_ease-in-out_infinite_0.8s]',
  mascotWrap: 'mt-12.5 flex relative flex-col items-center cursor-pointer z-4 [transition:transform_250ms_ease] hover:[transform:translateY(-4px)] focus-visible:[outline:3px_solid_#2447D1] focus-visible:outline-offset-[4px] focus-visible:rounded-[20px]',
  // ── Speech Bubble ──
  speechBubble: "mb-2 px-4 py-2.5 max-w-70 border-[1.5px] border-[#E2E8F0] bg-[#FFFFFF] relative text-center rounded-[16px] [box-shadow:0_10px_30px_rgba(21,33,59,0.08)] text-[0.875rem] font-bold text-[#15213B] [animation:nalaloginstage-bubblePop_280ms_cubic-bezier(0.34,1.56,0.64,1)] z-7 [&::after]:-bottom-2 [&::after]:left-[50%] [&::after]:w-0 [&::after]:h-0 [&::after]:border-t-8 [&::after]:border-r-8 [&::after]:border-l-8 [&::after]:border-t-[#FFFFFF] [&::after]:border-r-transparent [&::after]:border-l-transparent [&::after]:absolute [&::after]:content-[''] [&::after]:[transform:translateX(-50%)]",
  // ── Socratic Shield Centerpiece ──
  socraticShield: '[filter:drop-shadow(0_14px_28px_rgba(36,71,209,0.45))] [animation:nalaloginstage-shieldPulse_4s_ease-in-out_infinite]',
  // Shield star glow
  shieldStar: '[animation:nalaloginstage-starShine_3s_ease-in-out_infinite_alternate] [transform-origin:100px_115px]',
  // Eyes blinking animation
  blinkEyes: '[animation:nalaloginstage-owlBlink_5s_infinite] [transform-origin:center]',
  // Bottom Hint
  interactiveHint: 'mt-5 px-5.5 py-2 border border-[rgba(36,71,209,0.16)] relative select-none text-[0.8125rem] font-semibold [color:var(--color-ink,#15213B)] [background:rgba(255,255,255,0.92)] [box-shadow:0_4px_16px_rgba(21,33,59,0.08)] rounded-[999px] [backdrop-filter:blur(12px)] tracking-[0.01em] z-6 opacity-92 [transition:all_200ms_ease] [.nalaloginstage-mascotStageWrap:hover+&]:[border-color:var(--color-primary,#2447D1)] [.nalaloginstage-mascotStageWrap:hover+&]:bg-[#FFFFFF] [.nalaloginstage-mascotStageWrap:hover+&]:opacity-100 [.nalaloginstage-mascotStageWrap:hover+&]:[color:var(--color-primary,#2447D1)] [.nalaloginstage-mascotStageWrap:hover+&]:[transform:translateY(-2px)] [.nalaloginstage-mascotStageWrap:hover+&]:[box-shadow:0_6px_20px_rgba(36,71,209,0.16)] hover:[border-color:var(--color-primary,#2447D1)] hover:bg-[#FFFFFF] hover:opacity-100 hover:[color:var(--color-primary,#2447D1)] hover:[transform:translateY(-2px)] hover:[box-shadow:0_6px_20px_rgba(36,71,209,0.16)]',
} satisfies Record<string, string>

export default styles
