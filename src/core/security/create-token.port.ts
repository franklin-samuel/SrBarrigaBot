import {Command} from '../command.js';
import {Jwt} from '../../domain/jwt.js';

export abstract class CreateTokenPort extends Command<Promise<Jwt>> {}