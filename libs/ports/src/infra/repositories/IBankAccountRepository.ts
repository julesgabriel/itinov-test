import {CashWithdrawalResponse} from "@itinov/core";
import {BankAccount} from "../../../../core/src/entities/BankAccount";

export interface IBankAccountRepository {
  withDraw(amount: number, currentDate: Date): Promise<CashWithdrawalResponse>
  getAccountInfos(): Promise<BankAccount>
}
