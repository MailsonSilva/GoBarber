import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import uploadsConfig from '@config/upload';

import {Exclude, Expose} from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Expose({name: 'avatar_url'})
  getAvatarUrl(): string | null{
    if (! this.avatar){
      return null;
    }

    switch (uploadsConfig.driver){
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case "s3":
        return `https://${uploadsConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`
      default:
        return null;
    }

  }
}

export default User;
