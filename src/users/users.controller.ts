import {
  Body,
  Controller,
  Headers,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { TokensService } from '../tokens/tokens.service';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { HttpErrorResponse } from '../http-error-response';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}

  @Post('user')
  @ApiOperation({
    summary: 'Create a user',
    tags: ['user'],
  })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({
    status: 400,
    description: 'You must supply a userId, login, and password in the body',
    schema: HttpErrorResponse,
  })
  create(@Body() createUserDto: CreateUserDto): void {
    this.usersService.create(createUserDto);
  }

  @Post('authenticate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Authenticate a user',
    tags: ['authentication'],
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          pattern:
            '/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description:
      'User was found in the database, but the password given does not match',
    schema: HttpErrorResponse,
  })
  authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    const matchedUser = this.usersService.findOneByLogin(
      authenticateUserDto.login,
    );

    // 404 if there's no such user in the db
    if (!matchedUser) {
      throw new NotFoundException();
    }

    // 401 if user exists in the db but the password given doesn't match what's in the db
    if (matchedUser.password !== authenticateUserDto.password) {
      throw new UnauthorizedException();
    }

    // 200 if login and password match the user in the db. Send a token in the res.body.
    const token = this.tokensService.create(matchedUser);

    return {
      token,
    };
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Log a user out',
    tags: ['logout'],
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid user session',
    schema: HttpErrorResponse,
  })
  logout(@Headers('authentication-header') token: string) {
    // remove token from db
    this.tokensService.remove(token);
  }
}
