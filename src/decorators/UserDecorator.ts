import { createParamDecorator, ExecutionContext} from '@nestjs/common';

export const UserDecorator = createParamDecorator((data, contex: ExecutionContext) => {

  return contex.switchToHttp().getRequest().user;
})