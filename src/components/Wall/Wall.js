import React from 'react';
import './WallStyle.css';
import commentIcon from '../../assets/images/comment_icon.png';
import likeIcon from '../../assets/images/like_icon.png';
import shareIcon from '../../assets/images/share_icon.png';
import defaultAvatar from '../../assets/images/user.png';
import InfiniteScroll from 'react-infinite-scroller';

const PostList = ({ data, avatar, username }) => {
	return (
		<div className="Wall_Post_Container">
			<div className="Wall_Post_div1">
				<img
					className="Wall_Post_Image"
					src={
						avatar === '--' ? defaultAvatar : `data:image/jpeg;base64,${avatar}`
					}
				/>
				<div className="Wall_Post_div3">
					<p className="Wall_Post_Username">{username}</p>
					<span className="Wall_Post_PostContent">{data.text}</span>
				</div>
			</div>
			<div className="Wall_Post_div2">
				{/* <img className="Wall_Post_Icon" src={likeIcon} />
				<span className="Wall_Post_Statistic">12</span>
				<img className="Wall_Post_Icon" src={commentIcon} />
				<span className="Wall_Post_Statistic">2</span>
				<img className="Wall_Post_Icon" src={shareIcon} />
				<span className="Wall_Post_Statistic Wall_Post_Sub1">3</span> */}
				<button className="Wall_Post_ActionButton">Like</button>
				<button className="Wall_Post_ActionButton">Comment</button>
				<button className="Wall_Post_ActionButton">Share</button>
			</div>
			<div className="Wall_Post_Line" />
		</div>
	);
};

class Wall extends React.Component {
	handleScroll = () => {
		if (
			this.scroller &&
			this.scroller.scrollTop === this.scroller.scrollHeight - 760
		) {
			this.props.onLoadMoreData();
		}
	};

	render() {
		let postList = [];
		if (this.props.mode === 1) {
			for (let i = 0; i < this.props.postData.length; i++) {
				for (let j = 0; j < this.props.postData[i].posts.length; j++) {
					const data = (
						<PostList
							data={this.props.postData[i].posts[j]}
							avatar={this.props.avatar}
							username={this.props.username}
						/>
					);
					postList.push(data);
				}
			}
		} else {
			for (let i = 0; i < this.props.postData.length; i++) {
				var accountPosts = [];
				this.props.postData[i].posts.forEach(item => {
					const accountPostList = (
						<PostList
							data={item}
							avatar={this.props.postData[i].avatar}
							username={this.props.postData[i].username}
						/>
					);
					accountPosts.push(accountPostList);
				});
				postList.push(accountPosts);
			}
		}
		return (
			<div>
				<button
					className="Wall_Button"
					onClick={() => {
						this.props.onChangeMode(1);
					}}
				>
					YOUR POST
				</button>
				<button
					className="Wall_Button"
					style={{ marginLeft: 20 }}
					onClick={() => {
						this.props.onChangeMode(2);
					}}
				>
					EVERYONE POST
				</button>
				<button
					className="Wall_Button"
					style={{ marginLeft: 20 }}
					onClick={() => {
						alert('REFRESHING');
					}}
				>
					REFRESH
				</button>
				<div className="Wall_Container">
					{this.props.postData.length === 0 ? (
						<p className="Wall_Loading">LOADING! PLEASE WAIT</p>
					) : (
						<ul
							className="Wall_List"
							ref={scroller => {
								this.scroller = scroller;
							}}
							onScroll={this.handleScroll}
						>
							{postList}
						</ul>
					)}
				</div>
			</div>
		);
	}
}

export default Wall;
