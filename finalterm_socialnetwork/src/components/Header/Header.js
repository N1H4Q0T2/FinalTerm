import React from 'react';
import './HeaderStyle.css';

const Header = props => (
	<div className="Header_container">
		<button
			className="Header_TransferButton"
			onClick={props.currentRoute === '/' ? props.onTransfer : props.onHome}
		>
			{props.currentRoute === '/' ? 'TRANSFER' : 'HOME'}
		</button>
		<button className="Header_LogOutButton" onClick={props.onLogOut}>
			LOG OUT
		</button>
	</div>
);

export default Header;
