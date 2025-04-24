import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../user/infrastructure/entities/user.entity';
@Entity('url')
export class UrlOrmEntity {
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

  @ManyToOne(() => UserOrmEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @Column({ nullable: true })
  userId: string | null;
}
