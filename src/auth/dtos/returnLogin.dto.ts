import { ReturnUserDto } from '../../user/dtos/returnUser.dto';

export interface ReturnLoginDto {
  accessToken: string;
  user: ReturnUserDto;
}
