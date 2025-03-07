export class DatabaseError extends Error {
  constructor(error: string) {
    super(error)
    this.name = "DatabaseError"
  }
}
