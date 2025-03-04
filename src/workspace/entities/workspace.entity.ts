import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('workspaces')
export class Workspace {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @Column({ unique: true })
    slug!: string;

    @ManyToOne(() => User, (user) => user.workspaces)
    user!: User;
}
