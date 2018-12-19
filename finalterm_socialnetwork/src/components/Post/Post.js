import React from 'react';
import './PostStyle.css';

const Post = props => {
	console.log();
	return (
		<div className="TransferMoney_container">
			<div className="TransferMoney_window">
				<p className="TransferMoney_title">POST</p>
				<textarea
					className="Post_inputArea"
					onChange={e => props.update_Content(e.target.value)}
				/>
				<div className="TransferMoney_div2">
					<button className="TransferMoney_submit" onClick={props.onPost}>POST</button>
				</div>
			</div>
		</div>
	);
};

export default Post;
