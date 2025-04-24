export class User {
  constructor(
    public email: string,
    public password: string,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
