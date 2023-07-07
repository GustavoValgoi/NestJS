import { UserType } from '../enum/user-type.enum';
import { UserEntity } from '../entities/user.entity';

export const userEntityMock: UserEntity = {
  id: 1,
  name: 'Jesus cristo',
  email: 'email@email.com',
  phone: '41 99800-3401',
  cpf: '000.000.000-00',
  password: '$2b$10$Gx8qdfqLGvPsD40qaEB8huKnMGSg8KENd/BHdAxNL9oj.Q/C4s8Am',
  type_user: UserType.User,
  createdAt: new Date(),
  updatedAt: new Date(),
};
