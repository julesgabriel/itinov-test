import {UsecaseBase} from "./UsecaseBase";

export class CashWithdrawalUsecase extends UsecaseBase<any> {
  canExecute(): this {
    if(!this){
      // TODO check if the user has access to the resource
      this.deniedAccess()
    }
    return this;
  }

  execute(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
