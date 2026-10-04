const VALID_STEPS = ['1', '2', '3', '4'];

export function resolveInvalidStepRedirectPath(memberId: number, step: string | undefined) {
  if (step && VALID_STEPS.includes(step)) return null;

  return `/edit/${memberId}?step=1`;
}
