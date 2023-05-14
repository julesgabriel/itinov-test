import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {MyBankAccountRepositoryContext} from "../main";
import {BankAccount} from "../../../../libs/core/src/entities/BankAccount";
import {CashWithdrawalUsecase} from "@itinov/core";

const StyledApp = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0A192F; // Dark blue
  color: #E0E0E0; // Light grey
  font-family: Arial, sans-serif;
`;

const StyledHeader = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #63F5EF; // Bright blue
`;

const StyledSubHeader = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const StyledOperations = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const StyledOperationItem = styled.li`
  margin: 1rem 0;
  font-size: 1.5rem;
  color: ${props => props.negative ? '#8B0000' : '#63F5EF'};
`;

const StyledButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  color: #0A192F; // Dark blue
  background-color: #63F5EF; // Bright blue
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-out;

  &:hover {
    background-color: #39A0ED; // Mid-tone blue
  }
`;

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled.div`
  background-color: #0A192F; // Dark blue
  padding: 2rem;
  border-radius: 10px;
  width: 50%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  color: #E0E0E0; // Light grey
  margin: 1rem;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
`;

const ModalInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  color: #E0E0E0; // Light grey
  background-color: #1D2B44; // Darker blue
  border: none;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ModalButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  color: #0A192F; // Dark blue
  background-color: #63F5EF; // Bright blue
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-out;

  &:hover {
    background-color: #39A0ED; // Mid-tone blue
  }
`;

const AccountDetails = styled.div`
  background-color: #1D2B44; // Darker blue
  color: #E0E0E0; // Light grey
  padding: 1.5rem;
  border-radius: 10px;
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  max-width: 500px;
`;

const DetailItem = styled.div`
  text-align: center;
  border-right: ${props => props.borderProps ? '1px solid white' : 'none'};
  border-left: ${props => props.borderProps ? '1px solid white' : 'none'};
  padding: 0 2rem;
`;


export function App() {
  const [showModal, setShowModal] = useState(false);
  const [accountInfos, setAccountInfos] = useState<BankAccount>({
    amountOfMoneyWithDrewThisMonth: 0,
    ceiling: 0,
    currentAmount: 0,
    operations: []
  })
  const [withDrawValue, setWithDrawValue] = useState<number>(0)
  const repositoryInMemory = useContext(MyBankAccountRepositoryContext)

  async function getAccountInfos() {
    return await repositoryInMemory.getAccountInfos()
  }

  async function callWithDraw() {
    const withdrawUseCase = new CashWithdrawalUsecase(repositoryInMemory)
    withdrawUseCase.as({
      id: "good-id"
    }).with({
      user_id: "good-id",
      amount: withDrawValue,
      currentDate: new Date()
    }).run()
      .then(_ => {
        setShowModal(false)
      })
      .catch(err => {
        alert(err)
        setShowModal(false)
      })
  }

  useEffect(() => {
    getAccountInfos().then(res => {
      setAccountInfos(res)
    })
  }, [showModal])

  return (
    <StyledApp>
      <StyledHeader>Itibank</StyledHeader>
      <StyledSubHeader>Welcome User Name </StyledSubHeader>
      <AccountDetails>
        <DetailItem>
          <h3>Current Amount</h3>
          <p>{accountInfos.currentAmount}</p>
        </DetailItem>
        <DetailItem borderProps>
          <h3>Ceiling</h3>
          <p>{accountInfos.ceiling}</p>
        </DetailItem>
        <DetailItem>
          <h3>Amount Drew This Month</h3>
          <p>{accountInfos.amountOfMoneyWithDrewThisMonth}</p>
        </DetailItem>
      </AccountDetails>
      <div>
        <StyledOperations>
          {
            accountInfos.operations && accountInfos.operations.map((el, key) => {
              return <StyledOperationItem key={key} negative>
                Amount: {el.amount}
                <br/>
                Date: {el.date.toDateString()}
              </StyledOperationItem>
            })
          }
        </StyledOperations>
        <StyledButton onClick={() => setShowModal(true)}>Withdraw</StyledButton>
      </div>

      {showModal && (
        <StyledModal>
          <ModalContent>
            <ModalTitle>Enter Amount</ModalTitle>
            <ModalInput type="number" placeholder="Enter a number..." onChange={({target}) => {
              setWithDrawValue(+target.value)
            }}/>
            <ModalButton onClick={callWithDraw}>Submit</ModalButton>
          </ModalContent>
        </StyledModal>
      )}
    </StyledApp>
  );
}

export default App;
