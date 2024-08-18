
import { Card } from 'src/cards/entities/card.entity';
import { Team } from 'src/teams/entities/team.entity';
import { UserCard } from 'src/user-cards/entities/user-card.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {

    @PrimaryGeneratedColumn()
    _id?: number

    // Basic

    @Column({ nullable: false, default: 0 })
    idTelegram: number

    @Column({ default: 'Guest' })
    username: string

    @Column({ default: 1 })
    level: number

    @Column({ default: 1 })
    salary: number

    @Column({ default: 0 })
    rating: number

    @Column({ default: 100 })
    energy: number

    @Column({ default: 0 })
    coins: number

    // Dates

    @Column({ default: 0 })
    dateRegistartion: string

    @Column({ default: 0 })
    dateSalary: string

    @Column({ default: 0 })
    dateUpdated: string

    @Column({ default: 0 })
    dateOnline: string

    // Relations

    // @ManyToMany(type => Card, card => card.id)
    // cards: Card[]

    @OneToMany(() => UserCard, userCard => userCard.user)
    userCards: UserCard[];

    @ManyToMany(type => Team, team => team.id)
    teams: Team[]

    // @ManyToMany(type => User, user => user.id)
    // user: User[]

}

export default User;