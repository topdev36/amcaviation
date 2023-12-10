import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';

@Entity()
export class Tx {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quote_id: string;

  @Column()
  contractId: number;

  @Column()
  order_id: string;

  @Column()
  link: string;

  @Column("decimal", {precision: 6, scale: 2})
  amount: number;

  @Column()
  status: string;

  @Column()
  paid_time: Date;

  @ManyToOne(type => Contract, contract => contract.txs)
  contract: Contract;
}