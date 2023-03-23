import React from 'react'
import "./App.scss";

function Transaction({ transaction }) {
  return (
    <div>
        <h1>Transactions</h1>
        {transaction.length > 0 && <div>
            <div className='trans_container'>
                {transaction.map(tx => {
                    return <div className='container' key={tx.nonce}>
                        <p>Sender: {tx.sender}</p>
                        <p>Amount: {tx.amount}</p>
                        <p>Recipient: {tx.recipient}</p>
                        <p>Nonce: {tx.nonce}</p>
                        <p>Time: {tx.time}</p>
                    </div>
                })}
            </div>
        </div>}
    </div>
  )
}

export default Transaction;