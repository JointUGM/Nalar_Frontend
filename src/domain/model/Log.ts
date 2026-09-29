export class Log {
  readonly message: string
  readonly when: number

  constructor(message: string) {
    const normalizedMessage = message.trim()
    if (!normalizedMessage) {
      throw new Error('Enter a message.')
    }
    this.message = normalizedMessage
    this.when = Date.now()
  }
}
