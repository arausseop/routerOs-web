export interface User {
    
}
  
export abstract class UserData {
    abstract getData(): any[];
    abstract getUser(companyId: string): Promise<any>;
    abstract getUsers(): Promise<any>;
    abstract saveUser(data: object): Promise<any>;
}
  