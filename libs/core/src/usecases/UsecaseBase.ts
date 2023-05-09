import {IdentityProperties} from "./CashWithdrawalUsecase";

export abstract class UsecaseBase<T, C> {
  identity: IdentityProperties;
  command: C

  abstract canExecute(): this;

  abstract execute(): Promise<T>;

  as(identity: IdentityProperties): UsecaseBase<T, C> {
    this.identity = identity;
    return this;
  }

  with(command: C): UsecaseBase<T, C> {
    this.command = command;
    return this;
  }

  async run(): Promise<T> {
    return (await this.canExecute()).execute();
  }

  protected deniedAccess() {
    throw new Error('Access Denied')
  }
}
