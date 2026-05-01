import {Command} from '../command.js';
import {Jwt} from '../../domain/jwt.js';

export abstract class RefreshTokenPort extends Command<Promise<Jwt>> {}