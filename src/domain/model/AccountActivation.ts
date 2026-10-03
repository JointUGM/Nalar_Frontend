export interface ActivationProof {
  readonly activationId: string
  readonly tokenHash: string
}

export interface AccountActivation extends ActivationProof {
  readonly password: string
}
