

export class RefreshTokenRequest {
    refresh_token: string;

    constructor(refresh_token: string) {
        this.refresh_token = refresh_token;
    }
}