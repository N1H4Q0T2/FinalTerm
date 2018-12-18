import React from 'react';
import './LoginStyle.css';

const Login = props => {
	console.log();
	return (
		<div className="Login_Container">
			<div className="Login_Window">
				<p className="Login_title">FOREST NETWORK</p>
				<div className="Login_div1">
					<p className="Login_Field">Public key </p>
					<input
						className="Login_input"
						value={props.publicKey}
						onChange={e => props.update_PublicKey(e.target.value)}
					/>
				</div>
				<div className="Login_div1">
					<p className="Login_Field">Private key</p>
					<input
						className="Login_input"
						value={props.privateKey}
						onChange={e => props.update_PrivateKey(e.target.value)}
					/>
				</div>
				<div className="Login_div1">
					<button
						className="Login_login"
						onClick={props.onLogin}
					>
						LOGIN
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
