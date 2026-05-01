
export class UserResponse {
    id: string;
    name: string;
    email: string;
    createdAt: Date;

    constructor(partial: Partial<UserResponse>) {
        Object.assign(this, partial);
    }
}