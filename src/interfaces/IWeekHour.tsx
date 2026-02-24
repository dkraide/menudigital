export interface IWeekHour {
    dayOfWeek: string[];
    timePeriods: ITimePeriods;
}
export interface ITimePeriods {
    startTime: string;
    endTime: string;
}