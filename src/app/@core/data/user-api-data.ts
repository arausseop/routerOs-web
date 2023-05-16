export interface User {
    email: string;
    roles?: string[];
    uuid?: string;
    base64File?: string;
    roleGroups: any;
    firstName: string;
    lastName: string;
    dni: string;
    avatar: string;
    deleted?: boolean;
    active: boolean;
    expired?: boolean;
    expiredAt?: string;
    password?: string;
}

export abstract class UserApiData {
    abstract getData(): any[];
    abstract getUser(userId: string): Promise<any>;
    abstract getUsers(): Promise<any>;
    abstract getUsersByGroup(groupName: string): Promise<any>;
    abstract saveUser(data: object): Promise<any>;
    abstract newUser(data: object): Promise<any>;
    abstract deleteUser(userId: string): Promise<any>;
}
