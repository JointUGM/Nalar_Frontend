// Tailwind classes for NalaAlive.tsx.
// `nalaalive-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  part: '[transform-box:view-box] [transition:transform_560ms_cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:[transition:none]',
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  hop: '[transform-box:view-box] [transform-origin:100px_208px] motion-reduce:[animation:none]!',
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  breathe: '[transform-box:view-box] [transform-origin:100px_208px] [animation:nalaalive-breathe_3.2s_cubic-bezier(0.45,0,0.55,1)_infinite] motion-reduce:[animation:none]!',
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  jump: '[transform-box:view-box] [transform-origin:100px_208px] [animation:nalaalive-jump_1.8s_cubic-bezier(0.45,0,0.55,1)_infinite] motion-reduce:[animation:none]!',
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  eyes: 'nalaalive-eyes [transform-box:view-box] [transform-origin:100px_98px] [animation:nalaalive-open_300ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[animation:none]!',
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  blink: '[transform-box:view-box] [.nalaalive-eyes&]:[animation:nalaalive-open_300ms_cubic-bezier(0.23,1,0.32,1),nalaalive-blink_6.4s_ease-in-out_1.2s_infinite]',
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  wave: '[transform-box:view-box] [transform-origin:38px_138px] [animation:nalaalive-wave_1.6s_cubic-bezier(0.45,0,0.55,1)_infinite] motion-reduce:[animation:none]!',
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  brows: '[transform-box:view-box] [animation:nalaalive-brows_380ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[animation:none]!',
  // * Motion of the supplied mascot, opt-in through `animate`. SVG parts move in view-box units. * Only character motion keeps a slight spring; it settles quickly and never loops faster than a breath.
  gaze: '[transform-box:view-box] [transform:translate(var(--gaze-x,0px),var(--gaze-y,0px))] [transition:transform_180ms_ease-out] motion-reduce:[transition:none]',
  'hop-hello': '[animation:nalaalive-hopHello_520ms_cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:[animation:none]!',
  'hop-ask': '[animation:nalaalive-hopAsk_520ms_cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:[animation:none]!',
  'hop-think': '[animation:nalaalive-hopThink_520ms_cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:[animation:none]!',
  'hop-wow': '[animation:nalaalive-hopWow_520ms_cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:[animation:none]!',
  'hop-proud': '[animation:nalaalive-hopProud_520ms_cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:[animation:none]!',
  'hop-calm': '[animation:nalaalive-hopCalm_520ms_cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:[animation:none]!',
  'shadow-breathe': '[transform-box:fill-box] [transform-origin:center] [animation:nalaalive-shadowBreathe_3.2s_cubic-bezier(0.45,0,0.55,1)_infinite] motion-reduce:[animation:none]!',
  'shadow-jump': '[transform-box:fill-box] [transform-origin:center] [animation:nalaalive-shadowJump_1.8s_cubic-bezier(0.45,0,0.55,1)_infinite] motion-reduce:[animation:none]!',
  fade: '[animation:nalaalive-fade_260ms_ease-out] motion-reduce:[animation:none]!',
} satisfies Record<string, string>

export default styles
