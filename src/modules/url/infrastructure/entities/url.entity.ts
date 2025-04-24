import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('url')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 2048 })
  originalUrl: string;

  @Index({ unique: true })
  @Column({ unique: true, length: 6 })
  code: string;

  @Column({ default: 0 })
  clicks: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
