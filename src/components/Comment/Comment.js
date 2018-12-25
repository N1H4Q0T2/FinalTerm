import React from 'react';
import './CommentStyle.css';
import Popup from 'reactjs-popup';

const Comment = props => {
	return (
		<Popup position="right center">
			<div>Popup content here !!</div>
		</Popup>
	);
};

export default Comment;
