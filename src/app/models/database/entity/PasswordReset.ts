import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  token: string

  @Column()
  expires_on: Date

  constructor(passwordReset: Partial<PasswordReset>) {
    Object.assign(this, passwordReset)
  }
}
