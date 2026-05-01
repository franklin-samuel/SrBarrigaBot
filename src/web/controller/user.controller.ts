import {Body, Controller, HttpCode, HttpStatus, Inject, Post} from '@nestjs/common';
import {CreateUserPort} from '../../core/business/create-user.port.js';
import {Context} from '../../core/context.js';
import {User} from '../../domain/user.js';
import {ApiResponse} from '../commons/api.response.js';
import {UserRequest} from '../model/request/user.request.js'
import {UserResponse} from "../model/response/user.response.js";

@Controller('user')
export class UserController {
    constructor(
        private readonly createUserPort: CreateUserPort
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
}