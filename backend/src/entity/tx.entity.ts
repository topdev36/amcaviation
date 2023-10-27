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
  link: string;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column()
  paid_time: Date;

  @ManyToOne(type => Contract, contract => contract.txs)
  contract: Contract;
}