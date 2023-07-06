import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { LoginPayloadDto } from '../auth/dtos/loginPayload.dto';
import { authorizationToLoginPayload } from '../utils/base64-converter';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;

  const loginPayload: LoginPayloadDto = authorizationToLoginPayload(
    authorization?.split(' ')[1],
  );

  return loginPayload?.id;
});
