import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Tx } from "./tx.entity";

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quote_id: string;

  @Column()
  aircraft: string;

  @Column()
  email: string;

  @Column()
  date: string;

  @Column()
  creation: string;

  @Column("decimal", {precision: 6, scale: 2})
  sum: number;

  @Column()
  link: string;

  @Column()
  filename: string;

  @Column()
  signed_by: string;

  @Column()
  signed_time: Date;

  @OneToMany(type => Tx, tx => tx.contract)
  txs: Tx[];
}