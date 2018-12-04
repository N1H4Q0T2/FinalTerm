import React from 'react';
import './WallStyle.css';
import commentIcon from '../../assets/images/comment_icon.png';
import likeIcon from '../../assets/images/like_icon.png';
import shareIcon from '../../assets/images/share_icon.png';

const PostList = ({ data }) => {
	return (
		<div className="Wall_Post_Container">
			<div className="Wall_Post_div1">
				<img
					className="Wall_Post_Image"
					src="https://i.pinimg.com/originals/c4/0c/a8/c40ca880de32fb08c1e2cdc025c23480.jpg"
				/>
				<span className="Wall_Post_PostContent">
					Paragraphs writing competitions are part of skill and knowledge
					enhancement program for the students in the school. Now-a-days, almost
					all the schools are following this regime of essay or paragraphs
					writing in the classroom in order to enhance the student’s learning of
					English as well as proper awareness about the events and activities in
					India. We have provided various paragraphs on different topics in
					order to help students
				</span>
			</div>
			<div className="Wall_Post_div2">
				<img className="Wall_Post_Icon" src={likeIcon} />
				<span className="Wall_Post_Statistic">12</span>
				<img className="Wall_Post_Icon" src={commentIcon} />
				<span className="Wall_Post_Statistic">2</span>
				<img className="Wall_Post_Icon" src={shareIcon} />
				<span className="Wall_Post_Statistic Wall_Post_Sub1">3</span>
				<button className="Wall_Post_ActionButton">Like</button>
				<button className="Wall_Post_ActionButton">Comment</button>
				<button className="Wall_Post_ActionButton">Share</button>
			</div>

			<div className="Wall_Post_Line" />
		</div>
	);
};

const Wall = props => {
	let postList = [];
	for (let i = 0; i < 10; i++) {
		const item = <PostList data={i} />;
		postList.push(item);
	}
	return (
		<div className="Wall_Container">
			<ul className="Wall_List">{postList}</ul>
		</div>
	);
};

export default Wall;
