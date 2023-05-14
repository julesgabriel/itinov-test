import {IBankAccountRepository} from "@itinov/ports";
import {CashWithdrawalResponse} from "../usecases";
import {BankAccount} from "../entities/BankAccount";

export class BankAccountRepositoryInMemory implements IBankAccountRepository {
  private bankAccountInMemory: BankAccount

  feedsWith(account: BankAccount) {
    this.bankAccountInMemory = account
  }

  getAccountInfos(): Promise<BankAccount> {
    return Promise.resolve(this.bankAccountInMemory)
  }

  setInfos(infos) {
    this.bankAccountInMemory = {
      ...this.bankAccountInMemory,
      ...infos
    }
  }

  withDraw(amount: number, currentDate: Date): Promise<CashWithdrawalResponse> {
    const beforeDrewMoney = this.bankAccountInMemory.currentAmount
    const afterDrewCurrentAmount = beforeDrewMoney - amount
    this.setInfos({
        currentAmount: afterDrewCurrentAmount,
        ceiling: this.bankAccountInMemory.ceiling,
        amountOfMoneyWithDrewThisMonth: (this.bankAccountInMemory.amountOfMoneyWithDrewThisMonth + amount),
        operations: Array.isArray(this.bankAccountInMemory.operations)
          ? [...this.bankAccountInMemory.operations, {amount: amount, date: currentDate}]
          : [{amount: amount, date: currentDate}],
      }
    )
    return Promise.resolve({
      amountDrew: amount,
      currentMoney: this.bankAccountInMemory.currentAmount,
      beforeDrewMoney: beforeDrewMoney
    })
  }
}
