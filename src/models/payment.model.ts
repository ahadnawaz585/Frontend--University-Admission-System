export interface paymentData{
    id?:number;
    applicationId: number;
    paymentDate: Date;
    bankName: string;
    amountPaid: number;
}