import { getRepository } from 'typeorm'
import { User, UserRole } from 'app/database/entity/User'

async function main(): Promise<void> {
  const ADMIN = new User({
    username: 'admin',
    password: 'admin',
    email: 'admin@admin.com',
    role: UserRole.ADMIN
  })
  const saved = await getRepository(User).save(ADMIN)
  console.log('saved', saved)
}

main().catch(err => console.error(err))
