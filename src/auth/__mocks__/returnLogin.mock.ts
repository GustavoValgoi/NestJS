import { userEntityMock } from '../../user/__mocks__/user.mock';
import { ReturnLoginDto } from '../dtos/returnLogin.dto';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { jwtMock } from './jwt.mock';

export const returnLoginMock: ReturnLoginDto = {
  user: new ReturnUserDto(userEntityMock),
  accessToken: jwtMock,
};
