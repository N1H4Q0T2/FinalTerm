import React from 'react';
import './TransferMoneyStyle.css';

const TransferMoney = props => {
	console.log();
	return (
		<div className="TransferMoney_container">
			<div className="TransferMoney_window">
				<p className="TransferMoney_title">TRANSFER MONEY</p>
				<div className="TransferMoney_div1">
					<p className="TransferMoney_field">Amount</p>
					<input
						className="TransferMoney_input"
						type="number"
						onChange={e => props.updateAmount(e.target.value)}
					/>
				</div>
				<div className="TransferMoney_div1">
					<p className="TransferMoney_field">Address</p>
					<input
						className="TransferMoney_input"
						value={props.address}
						onChange={e => props.updateAddress(e.target.value)}
					/>
				</div>
				<div className="TransferMoney_div2">
					<button className="TransferMoney_submit" onClick={props.submitTransfer}>SUBMIT</button>
				</div>
			</div>
		</div>
	);
};

export default TransferMoney;
