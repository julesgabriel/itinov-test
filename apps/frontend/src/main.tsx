import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {createContext} from "react";
import App from './app/app';
import {BankAccountRepositoryInMemory} from "@itinov/core";

const BankAccountRepository = new BankAccountRepositoryInMemory();

BankAccountRepository.feedsWith({
  currentAmount: 4000,
  ceiling: 3000,
  amountOfMoneyWithDrewThisMonth: 0
})

export const MyBankAccountRepositoryContext = createContext(BankAccountRepository)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <MyBankAccountRepositoryContext.Provider value={BankAccountRepository}>
      <App />
      </MyBankAccountRepositoryContext.Provider>
    </BrowserRouter>
  </StrictMode>
);
