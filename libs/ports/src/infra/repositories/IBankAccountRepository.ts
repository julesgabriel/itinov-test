import {CashWithdrawalResponse} from "@itinov/core";
import {BankAccount} from "../../../../core/src/entities/BankAccount";

export interface IBankAccountRepository {
  withDraw(amount: number): Promise<CashWithdrawalResponse>
  getAccountInfos(): Promise<BankAccount>
}
