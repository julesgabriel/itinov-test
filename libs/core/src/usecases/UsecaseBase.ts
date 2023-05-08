export abstract class UsecaseBase<T> {
  abstract canExecute(): this;

  abstract execute(): Promise<T>;

  async run(): Promise<T> {
    return (await this.canExecute()).execute();
  }

  deniedAccess(){
    return new Error('Not access to the resource')
  }
}
