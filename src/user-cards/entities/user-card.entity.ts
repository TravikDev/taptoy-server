import { Card } from 'src/cards/entities/card.entity';
import User from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
// import { User } from './user.entity';
// import { Card } from './card.entity';

@Entity()
export class UserCard {
  @PrimaryGeneratedColumn()
  _id: number;

  @ManyToOne(() => User, user => user.userCards)
  user: User;

  @ManyToOne(() => Card, card => card.userCards)
  card: Card;

  @Column({ default: 1 })
  level: number; // Уровень прокачки карточки

  @Column({ type: 'int', default: 1 })
  salary: number; // Опыт, набранный для этой карточки

  @Column({ type: 'int', default: 1 })
  upgradeCost: number; // Опыт, набранный для этой карточки
}
