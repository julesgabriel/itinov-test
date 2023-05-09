import {UsecaseBase} from "./UsecaseBase";

export type IdentityProperties = {
  id: string
}

export type UserCommand = {
  user_id: string,
  amount: number,
  currentAccountAmount: number,
}

export type CashWithdrawalResponse = {
  // user_name: string,
  amountDrew: number,
  currentMoney: number,
  beforeDrewMoney: number
}

export class CashWithdrawalUsecase extends UsecaseBase<CashWithdrawalResponse, UserCommand> {
  canExecute(): this {
    if (this.identity.id !== this.command.user_id) {
      this.deniedAccess()
    }
    return this;
  }

  async execute(): Promise<CashWithdrawalResponse> {
    const currentMoney = this.command.currentAccountAmount - this.command.amount;
    return {
      currentMoney,
      amountDrew: this.command.amount,
      beforeDrewMoney: this.command.currentAccountAmount
    };
  }
}
