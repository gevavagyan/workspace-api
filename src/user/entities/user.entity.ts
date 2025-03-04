import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Workspace} from "../../workspace/entities/workspace.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 500 })
    email!: string;

    @Column('text')
    fullName!: string;

    @Column()
    password!: string;

    @Column()
    verified!: boolean;

    @OneToMany(() => Workspace, (workspace) => workspace.user)
    workspaces!: Workspace[];
}
