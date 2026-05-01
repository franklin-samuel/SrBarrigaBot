import {AbstractDomain} from "./abstract.domain.js";


export class Jwt extends AbstractDomain {

    access_token?: string;
    refresh_token?: string;
    type?: string;
    role?: string[];

}