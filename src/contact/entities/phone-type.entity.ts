import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Phone } from './phone.entity';

@Entity({ name: 'PhoneType' })
export class PhoneType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  typeName: string;

  @OneToMany(() => Phone, (phone) => phone.phoneType)
  phones: Phone[];
}
