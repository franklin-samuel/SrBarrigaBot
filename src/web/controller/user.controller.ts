import {Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, UseGuards} from '@nestjs/common';
import {CreateUserPort} from '../../core/business/create-user.port.js';
import {Context} from '../../core/context.js';
import {User} from '../../domain/user.js';
import {ApiResponse} from '../commons/api.response.js';
import {UserRequest} from '../model/request/user.request.js'
import {UserResponse} from "../model/response/user.response.js";
import {UserRepositoryPort} from "../../core/persistence/user.repository.port.js";
import {BusinessException} from "../../domain/exceptions/business.exception.js";
import {JwtAuthGuard} from "../../security/guards/jwt-auth.guard.js";

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly createUserPort: CreateUserPort,
        private readonly userRepositoryPort: UserRepositoryPort,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() request: UserRequest): Promise<ApiResponse<UserResponse>> {
        const user = new User();
        user.name = request.name;
        user.email = request.email;
        user.password = request.password;

        const context = new Context(user);
        const savedUser = await this.createUserPort.execute(context);

        const response: UserResponse = new UserResponse({
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            createdAt: savedUser.createdAt,
        });

        return ApiResponse.success(response, 'Usuário criado com sucesso');
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    async me(@Req() req: any): Promise<ApiResponse<UserResponse>> {
        const userId = req.userId;
        const user = await this.userRepositoryPort.get(userId);

        if (!user) {
            throw new BusinessException('Usuário não encontrado');
        }

        const response: UserResponse = new UserResponse({
            id: userId,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        });

        return ApiResponse.success(response)
    }
}