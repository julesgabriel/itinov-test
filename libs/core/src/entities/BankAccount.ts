export type AccountOperations = {
  amount: number;
  date: Date
}

export class BankAccount {
  constructor(attributes) {
    Object.assign(this, attributes)
  }

  currentAmount: number;
  ceiling: number;
  amountOfMoneyWithDrewThisMonth?: number = 0
  operations: AccountOperations[] = []
}
