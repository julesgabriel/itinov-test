import {UsecaseBase} from "./UsecaseBase";
import {IBankAccountRepository} from "@itinov/ports";
import {ac} from "vitest/dist/types-b7007192";

export type UserCommand = {
  user_id: string,
  amount: number,
}

export type CashWithdrawalResponse = {
  amountDrew: number,
  currentMoney: number,
  beforeDrewMoney: number
}

export class CashWithdrawalUsecase extends UsecaseBase<CashWithdrawalResponse, UserCommand> {
  constructor(
    private readonly bankAccountRepository: IBankAccountRepository
  ) {
    super();
  }


  async canExecute(): Promise<this> {
    if (this.identity.id !== this.command.user_id) {
      this.deniedAccess()
    }
    const accountInfos = await this.bankAccountRepository.getAccountInfos()
    if ((accountInfos.amountOfMoneyWithDrewThisMonth + this.command.amount) > accountInfos.ceiling) {
      throw new Error('Cannot withdraw more money, ceiling reached')
    }
    return this;
  }

  async execute(): Promise<CashWithdrawalResponse> {
    return await this.bankAccountRepository.withDraw(this.command.amount)
  }
}
