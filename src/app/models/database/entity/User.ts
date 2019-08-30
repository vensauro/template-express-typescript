import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn
} from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column({ unique: true })
  email: string

  @Column({
    select: false
  })
  password: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole

  @Column()
  @CreateDateColumn()
  created_at: Date

  @Column()
  @UpdateDateColumn()
  updated_at: Date

  constructor(user?: Partial<User>) {
    Object.assign(this, user)
  }

  static repository(): Repository<User> {
    return getRepository(User)
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(): void {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
    if (!this.password) throw new Error('Model without password')
    return bcrypt.compareSync(unencryptedPassword, this.password)
  }

  generateToken(): string {
    return jwt.sign(
      {
        user: {
          id: this.id,
          name: this.username,
          role: this.role
        }
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TTL }
    )
  }
}
