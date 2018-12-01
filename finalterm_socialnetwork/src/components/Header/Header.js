import React from 'react';
import './HeaderStyle.css';

const Header = props => (
	<div className="Header_container">
		<button className="Header_LogOutButton" onClick={props.onLogOut}>LOG OUT</button>
	</div>
);

export default Header;
