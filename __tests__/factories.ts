import * as faker from 'faker'

import { User, UserRole } from '../src/app/models/database/entity'

async function userFactory(
  userAtt?: Partial<User>
): Promise<[Partial<User>, User]> {
  const DataToSave: Partial<User> = {
    ...{
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.name.findName(),
      role: UserRole.USER
    },
    ...userAtt
  }
  const user = new User(DataToSave)

  await User.repository().save(user)
  return [DataToSave, user]
}

export default userFactory
