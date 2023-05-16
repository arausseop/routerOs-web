export interface UserCompany {
    
}
  
export abstract class UserCompanyData {
    abstract getData(): any[];
    abstract getUserCompany(userCompanyId: string): Promise<any>;
    abstract getUserCompanies(companyId: number, userId: number): Promise<any>;
    abstract newUserCompany(data: object): Promise<any>;
    abstract deleteUserCompany(userCompanyId: string): Promise<any>;
}
  