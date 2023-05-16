export interface Report {
    field: number,
    device: number,
    dateRange: any,
    groundGraphConductivity: boolean,
    groundGraphTemperature: boolean,
    groundGraphPontencialRedox: boolean,
    groundGraphPh: boolean,
    groundGraphHumidity: boolean,
    airCarbonDioxide: boolean,
    airOrganicComp: boolean,
    ambientTemperature: boolean,
    ambientLight: boolean,
}
  
export abstract class ReportData {
    abstract getReport(data: any): Promise<any>;
}
  