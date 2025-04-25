export class Url {
  constructor(
    public originalUrl: string,
    public code: string,
    public userId: string | null = null,
    public id?: string,
    public clicks?: number,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deletedAt: Date | null = null,
  ) {}
}
