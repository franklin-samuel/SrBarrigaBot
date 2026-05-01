


export class JwtResponse {
    access_token: string;
    refresh_token: string;
    type: string;
    role: string[];

    constructor(init?: Partial<JwtResponse>) {
        Object.assign(this, init);
    }
}