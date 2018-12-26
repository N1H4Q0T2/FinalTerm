import React from 'react';
import './WallStyle.css';
import Popup from 'reactjs-popup';
import likeIcon from '../../assets/images/like.png';
import angryIcon from '../../assets/images/angry.png';
import sadIcon from '../../assets/images/crying.png';
import loveIcon from '../../assets/images/in-love.png';
import hahaIcon from '../../assets/images/laugh.png';
import wowIcon from '../../assets/images/shocked.png';
import defaultAvatar from '../../assets/images/user.png';
import { Submit } from '../../containers';

const PostList = ({
	data,
	avatar,
	username,
	onCommentPopup,
	onReactOnPost,
}) => {
	const { reaction } = data;
	var likeCount = 0,
		loveCount = 0,
		hahaCount = 0,
		wowCount = 0,
		sadCount = 0,
		angryCount = 0;
	reaction.forEach(item => {
		if (item.reaction === 1) likeCount++;
		if (item.reaction === 2) loveCount++;
		if (item.reaction === 3) hahaCount++;
		if (item.reaction === 4) wowCount++;
		if (item.reaction === 5) sadCount++;
		if (item.reaction === 6) angryCount++;
	});
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
				<img
					className="Wall_Post_Icon"
					src={likeIcon}
					onClick={() => {
						const reactDatat = {
							...data,
							username: username,
						};
						onReactOnPost(reactDatat, 1);
					}}
				/>
				<span className="Wall_Post_Statistic">{likeCount}</span>
				<img
					className="Wall_Post_Icon"
					src={loveIcon}
					onClick={() => {
						const reactDatat = {
							...data,
							username: username,
						};
						onReactOnPost(reactDatat, 2);
					}}
				/>
				<span className="Wall_Post_Statistic">{loveCount}</span>
				<img
					className="Wall_Post_Icon"
					src={hahaIcon}
					onClick={() => {
						const reactDatat = {
							...data,
							username: username,
						};
						onReactOnPost(reactDatat, 3);
					}}
				/>
				<span className="Wall_Post_Statistic">{hahaCount}</span>
				<img
					className="Wall_Post_Icon"
					src={wowIcon}
					onClick={() => {
						const reactDatat = {
							...data,
							username: username,
						};
						onReactOnPost(reactDatat, 4);
					}}
				/>
				<span className="Wall_Post_Statistic">{wowCount}</span>
				<img
					className="Wall_Post_Icon"
					src={sadIcon}
					onClick={() => {
						const reactDatat = {
							...data,
							username: username,
						};
						onReactOnPost(reactDatat, 5);
					}}
				/>
				<span className="Wall_Post_Statistic">{sadCount}</span>
				<img
					className="Wall_Post_Icon"
					src={angryIcon}
					onClick={() => {
						const reactDatat = {
							...data,
							username: username,
						};
						onReactOnPost(reactDatat, 6);
					}}
				/>
				<span className="Wall_Post_Statistic">{angryCount}</span>
				<button
					className="Wall_Post_ActionButton"
					onClick={() => {
						const postData = {
							data: data,
							avatar: avatar,
							username: username,
						};
						onCommentPopup(postData);
					}}
				>
					Comment
				</button>
			</div>
			<div className="Wall_Post_Line" />
		</div>
	);
};

const CommentItem = ({ data, avatar, username }) => {
	return (
		<div>
			<div className="Wall_Popup_Comment_List_Container">
				<img
					className="Wall_Popup_Comment_List_Avatar"
					src={
						avatar === '--' ? defaultAvatar : `data:image/jpeg;base64,${avatar}`
					}
				/>
				<div className="Wall_Popup_Comment_List_div1">
					<div className="Wall_Popup_Comment_List_Username">
						{username === '' ? '--' : username}
					</div>
					<div className="Wall_Popup_Comment_List_Content">{data}</div>
				</div>
			</div>
			<div className="Wall_Popup_Comment_List_Line" />
		</div>
	);
};

class Wall extends React.Component {
	handleScroll = () => {
		if (
			this.scroller &&
			this.scroller.scrollTop === this.scroller.scrollHeight - 750
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
							onCommentPopup={this.props.onCommentPopup}
							onReactOnPost={this.props.onReactOnPost}
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
							onCommentPopup={this.props.onCommentPopup}
							onReactOnPost={this.props.onReactOnPost}
						/>
					);
					accountPosts.push(accountPostList);
				});
				postList.push(accountPosts);
			}
		}
		let commentList = [];
		if (this.props.openCommentPopup) {
			for (let i = 0; i < this.props.onePostData.comments.length; i++) {
				const item = this.props.onePostData.comments[i];
				if (item.comment.text.length >= 1) {
					const data = (
						<CommentItem
							data={item.comment.text}
							avatar={item.avatar}
							username={item.username}
						/>
					);
					commentList.push(data);
				}
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
				<Popup
					position="right center"
					open={this.props.openCommentPopup}
					contentStyle={{ width: 600, height: 800, padding: 0 }}
					onClose={() => {
						this.props.onCommentPopup(null);
					}}
					lockScroll={true}
					on="focus"
				>
					{this.props.openCommentPopup && (
						<div className="Wall_Popup_Container">
							<div className="Wall_Popup_div1">
								<img
									className="Wall_Popup_Avatar"
									src={
										this.props.onePostData.avatar === '--'
											? defaultAvatar
											: `data:image/jpeg;base64,${
												this.props.onePostData.avatar
											  }`
									}
								/>
								<div className="Wall_Popup_div2">
									<span className="Wall_Popup_Username">
										{this.props.onePostData.username}
									</span>
									<span className="Wall_Popup_PostContent">
										{this.props.onePostData.data.text}
									</span>
								</div>
							</div>
							<div className="Wall_Popup_Line" />
							<div className="Wall_Popup_Comment_List">
								<ul>{commentList}</ul>
							</div>
							<div className="Wall_Popup_Comment_Container">
								<textarea
									className="Wall_Popup_Comment"
									value={this.props.commentData}
									onChange={e => {
										if (e.target.value !== '' && e.target.value !== ' ') {
											this.props.onUpdateCommentData(e.target.value);
										}
									}}
								/>
								<button
									className="Wall_Popup_Comment_Button"
									onClick={() => {
										this.props.onCommentOnePost();
									}}
								>
									Comment
								</button>
							</div>
						</div>
					)}
					{this.props.isSubmitting && (
						<div className="Wall_Processing_Comment_Container">
							<span className="Wall_Processing_Comment_Content">
								PROCESSING...
							</span>
						</div>
					)}
				</Popup>
			</div>
		);
	}
}

export default Wall;
