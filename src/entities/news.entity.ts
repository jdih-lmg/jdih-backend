import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { NewsCategory } from './news-categories.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'thumbnail_url', length: 255, nullable: true })
  thumbnailUrl?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author?: User | null;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt?: Date | null;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @ManyToMany(() => NewsCategory, (category) => category.news, { cascade: true })
  @JoinTable({
    name: 'news_category_relations',
    joinColumn: { name: 'news_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories?: NewsCategory[] | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}
