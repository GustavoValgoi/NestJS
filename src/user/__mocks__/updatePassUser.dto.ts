import { UpdatePasswordDto } from '../dtos/updatePassword.dto';

export const updatePasswordMock: UpdatePasswordDto = {
  lastPassword: '123456',
  newPassword: 'abc',
};

export const updatePasswordInvalidMock: UpdatePasswordDto = {
  lastPassword: 'sacnsicsi',
  newPassword: 'poaspaospa',
};
