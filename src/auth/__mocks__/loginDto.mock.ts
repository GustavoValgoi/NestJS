import { userEntityMock } from '../../user/__mocks__/user.mock';
import { LoginDto } from '../dtos/login.dto';

export const loginDto: LoginDto = {
  email: userEntityMock.email,
  password: '123456',
};
