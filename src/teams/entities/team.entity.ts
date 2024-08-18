import User from "src/users/entities/user.entity"
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm"

@Entity()
export class Team {
    @PrimaryColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column({ default: 1 })
    level: number

    @Column()
    salary: number

    @Column()
    rph: number

    @Column()
    progress: number

    @Column()
    urlPicture: string

    // Relations

    @ManyToMany(type => User, user => user._id)
    cards: User[]
}
