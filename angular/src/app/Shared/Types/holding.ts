
export class Holding{
    Id: string;
    Pset: string;
    Isin: string;
    TradeDate: Date;
    SettlementDate: Date;
    Valid: boolean;
    TotalAmount: number;
    AvailableAmount: number;
    Status: string;
    Account: Account;
    ToTransferAmount: number;
    Message: string;

    constructor();
    constructor(obj: Partial<Holding>);
    constructor(obj?: Partial<Holding>){
        Object.assign(this, obj);
    }
}

export class Account{
    Name: string;
    Number: string;
    Valid: boolean;
    constructor();
    constructor(obj: Partial<Account>);
    constructor(obj?: Partial<Account>){
        Object.assign(this, obj);
    }
}