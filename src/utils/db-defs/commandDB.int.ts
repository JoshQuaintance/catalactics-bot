export interface CommandDbType {
    prefix: string,
    amountCalled: number,
    save: (err: any) => void;
}
