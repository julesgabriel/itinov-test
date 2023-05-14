import {
  CashWithdrawalUsecase,
  UserCommand
} from "./CashWithdrawalUsecase";
import {IdentityProperties} from "../entities/IdentityProperties";
import {BankAccountRepositoryInMemory} from "../repositories/BankAccountRepositoryInMemory";
import {BankAccount} from "../entities/BankAccount";


const badId: IdentityProperties = {
  id: 'bad_id'
}

const goodSimpleCommand: UserCommand = {
  user_id: 'good_id',
  amount: 300,
}

const goodDifferentCommand: UserCommand = {
  user_id: 'good_id',
  amount: 200,
}


let cashWithdrawalUsecase
let bankAccountRepository: BankAccountRepositoryInMemory;

describe('CashWithdrawal usecase', () => {
  beforeEach(() => {
    bankAccountRepository = new BankAccountRepositoryInMemory()
    cashWithdrawalUsecase = new CashWithdrawalUsecase(bankAccountRepository)
  })

  describe('canExecute', () => {
    it('should throw deniedAccess when identity is not good the same as the one making the request', async () => {
      const errorOnRun = cashWithdrawalUsecase.as(badId).with(goodSimpleCommand).run();
      await expect(() => errorOnRun).rejects.toThrow();
    })
    it('Should throw when no more monet is withdraw-able', () => {
      bankAccountRepository.feedsWith(new BankAccount({
          currentAmount: 3500,
          ceiling: 3000,
        })
      )
      bankAccountRepository.withDraw(2900)
      bankAccountRepository.withDraw(100)
      const canExecute = cashWithdrawalUsecase.as({
        id: goodSimpleCommand.user_id
      }).with({
        user_id: 'good_id',
        amount: 100,
      }).run()
      expect(canExecute).rejects.toThrow(new Error('Cannot withdraw more money, ceiling reached'))
    })
  })

  describe('execute', () => {
    it('Should return the object with good currentAmount withdrew and with the current money on the account to be equal to 1000 that is sub from withdrew and beforeDrew money', async () => {
      await bankAccountRepository.feedsWith(new BankAccount({
        currentAmount: 2000,
        ceiling: 3000,
      }))
      const goodRun = cashWithdrawalUsecase.as({
        id: goodSimpleCommand.user_id
      }).with(goodSimpleCommand).run();

      await expect(goodRun).resolves.toEqual({
        currentMoney: 1700,
        amountDrew: goodSimpleCommand.amount,
        beforeDrewMoney: 2000,
      })
    })

    it('Should return the object with good currentAmount withdrew when input is different and bankAccount updated', async () => {
      await bankAccountRepository.feedsWith(new BankAccount({
        currentAmount: 2000,
        ceiling: 3000,
      }))
      const goodRun = cashWithdrawalUsecase.as({
        id: goodDifferentCommand.user_id
      }).with(goodDifferentCommand).run();
      await expect(goodRun).resolves.toEqual({
        currentMoney: 1800,
        amountDrew: goodDifferentCommand.amount,
        beforeDrewMoney: 2000,
      })
    })
  })
})
