export interface RoleGroup {

}

export abstract class RoleGroupData {
    abstract getData(): any[];
    abstract getGroup(companyId: string): Promise<any>;
    abstract getGroups(): Promise<any>;
}
