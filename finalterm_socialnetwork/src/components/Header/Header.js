import React from 'react';
import './HeaderStyle.css';

const Header = props => (
	<div className="Header_container">
		{props.currentRoute === '/dashboard' && (
			<button className="Header_TransferButton" onClick={props.onPost}>
				POST
			</button>
		)}
		{props.currentRoute === '/dashboard' && (
			<button className="Header_TransferButton" onClick={props.onTransfer}>
				TRANSFER
			</button>
		)}
		{props.currentRoute !== '/dashboard' && (
			<button className="Header_TransferButton" onClick={props.onHome}>
				HOME
			</button>
		)}
		{props.currentRoute !== '/' && (
			<button className="Header_LogOutButton" onClick={props.onLogOut}>
				LOG OUT
			</button>
		)}
	</div>
);

export default Header;
