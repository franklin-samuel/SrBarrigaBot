import {IsEmail, IsNotEmpty} from "class-validator";


export class AuthRequest {
    @IsEmail({}, { message: 'O e-mail deve ser um endereço válido' })
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}