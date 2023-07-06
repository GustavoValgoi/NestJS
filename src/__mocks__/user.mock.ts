import { UserType } from '../user/enum/user-type.enum';
import { UserEntity } from '../user/entities/user.entity';

export const userEntityMock: UserEntity = {
  id: 1,
  name: 'Jesus cristo',
  email: 'email@email.com',
  phone: '41 99800-3401',
  cpf: '000.000.000-00',
  password: '12346',
  type_user: UserType.User,
  createdAt: new Date(),
  updatedAt: new Date(),
};
