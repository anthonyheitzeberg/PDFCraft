import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Org } from './org.entity';

export const GetOrg = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Org => {
    const request = ctx.switchToHttp().getRequest();
    return request.org; // Adjust this based on how you attach the org to the request
  },
);