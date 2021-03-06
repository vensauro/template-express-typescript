/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm'

import { User, UserRole } from '../entity/User'

export class CreateAdminUser1565273039577 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    const admin = new User({
      username: 'admin',
      password: 'admin',
      email: 'admin@admin.com',
      role: UserRole.ADMIN
    })
    await User.repository().save(admin)
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    const userRepository = User.repository()
    const admin = await userRepository.find({
      email: 'admin@admin.com'
    })
    await userRepository.remove(admin)
  }
}
