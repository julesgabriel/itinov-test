import {CashWithdrawalUsecase, IdentityProperties, UserCommand} from "./CashWithdrawalUsecase";


const badId: IdentityProperties = {
  id: 'bad_id'
}

const goodSimpleCommand: UserCommand = {
  user_id: 'good_id',
  amount: 300,
  currentAccountAmount: 1300,
}

const goodDifferentCommand: UserCommand = {
  user_id: 'good_id',
  amount: 200,
  currentAccountAmount: 1400,
}

const cashWithdrawalUsecase = new CashWithdrawalUsecase();

describe('CashWithdrawal usecase', () => {
  let cashWithDrawalUsecase
  beforeEach(() => {
    cashWithDrawalUsecase = new CashWithdrawalUsecase()
  })

  describe('canExecute', () => {
    it('should throw deniedAccess when identity is not good the same as the one making the request', async () => {
      const errorOnRun = cashWithdrawalUsecase.as(badId).with(goodSimpleCommand).run();
      await expect(() => errorOnRun).rejects.toThrow();
    })
  })

  describe('execute', () => {
    it('Should return the object with good currentAmount withdrew and with the current money on the account to be equal to 1000 that is sub from withdrew and beforeDrew money', async () => {
      const goodRun = cashWithdrawalUsecase.as({
        id: goodSimpleCommand.user_id
      }).with(goodSimpleCommand).run();
      await expect(goodRun).resolves.toEqual({
        currentMoney: 1000,
        amountDrew: goodSimpleCommand.amount,
        beforeDrewMoney: 1300,
      })
    })

    it('Should return the object with good currentAmount withdrew when input is different', async () => {
      const goodRun = cashWithdrawalUsecase.as({
        id: goodDifferentCommand.user_id
      }).with(goodDifferentCommand).run();
      await expect(goodRun).resolves.toEqual({
        currentMoney: 1200,
        amountDrew: goodDifferentCommand.amount,
        beforeDrewMoney: 1400,
      })
    })
  })
})
