import * as bcrypt from 'bcrypt';

export class PasswordEncoder {
    private readonly saltRounds = 10;

    async encode(rawPassword: string): Promise<string> {
        return bcrypt.hash(rawPassword, this.saltRounds);
    }

    async matches(rawPassword: string, encodedPassword: string): Promise<boolean> {
        return bcrypt.compare(rawPassword, encodedPassword);
    }
}