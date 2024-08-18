import { UserCard } from "src/user-cards/entities/user-card.entity";
import User from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    _id: number

    @Column({ default: 'Title' })
    title: string

    @Column({ default: 'Description' })
    description: string

    @Column({ default: 1 })
    level: number

    @Column({ default: 1 })
    salary: number

    @Column({ default: 1 })
    rph: number

    @Column({ default: 0 })
    progress: number

    @Column({ default: 'http://google.com/' })
    urlPicture: string

    @Column({ default: 1 })
    price: number


    @Column({ default: '1' })
    dateCreation: string

    @Column({ default: 0 })
    upgradeCost: number

    // Relations

    // @ManyToMany(type => User, user => user._id)
    // cards: User[]

    @OneToMany(() => UserCard, userCard => userCard.card)
    userCards: UserCard[];

    // @Column()
    // public user: User


}
