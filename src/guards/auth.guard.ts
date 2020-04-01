import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(ctx: ExecutionContext): boolean {
    ctx.switchToHttp().getRequest().user = this.usersService.findOneByToken(
      ctx
        .switchToHttp()
        .getRequest()
        .get('authentication-header'),
    );
    if (!ctx.switchToHttp().getRequest().user) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
