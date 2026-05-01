import {AbstractDomain} from './abstract.domain.js';

export class User extends AbstractDomain {
    name: string;
    email: string;
    password: string;
}