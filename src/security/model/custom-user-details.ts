export class CustomUserDetails {
    userId: string;
    username: string;
    password: string;
    isAccountNonExpired: boolean;
    isAccountNonLocked: boolean;
    isCredentialsNonExpired: boolean;
    isEnabled: boolean;

    constructor(
        userId: string,
        username: string,
        password: string,
    ) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.isAccountNonExpired = true;
        this.isAccountNonLocked = true;
        this.isCredentialsNonExpired = true;
        this.isEnabled = true;
    }
}