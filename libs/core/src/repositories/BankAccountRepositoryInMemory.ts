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

  get inMemory() {
    return this.bankAccountInMemory
  }

  withDraw(amount: number): Promise<CashWithdrawalResponse> {
    const beforeDrewMoney = this.bankAccountInMemory.currentAmount
    const afterDrewCurrentAmount = beforeDrewMoney - amount
    this.feedsWith(new BankAccount({
        currentAmount: afterDrewCurrentAmount,
        ceiling: 3000,
        amountOfMoneyWithDrewThisMonth: this.inMemory.amountOfMoneyWithDrewThisMonth += amount
      }
    ))
    return Promise.resolve({
      amountDrew: amount,
      currentMoney: this.bankAccountInMemory.currentAmount,
      beforeDrewMoney: beforeDrewMoney
    })
  }
}
