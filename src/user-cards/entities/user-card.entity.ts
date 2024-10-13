import { Card } from 'src/cards/entities/card.entity';
import User from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class UserCard {
  @PrimaryGeneratedColumn()
  _id: number;

  @ManyToOne(() => User, user => user.userCards)
  user: User;

  @ManyToOne(() => Card, card => card.userCards)
  card: Card;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'int', default: 5 })
  salary: number;

  @Column({ type: 'int', default: 0 })
  upgradeCost: number;
}
