import React from 'react';

import Comment from './Comment';
import classes from './Comment.module.scss';

const CommentsList = (props) => {
	return (
		<div className={classes['comments-container']}>
			{props.comments.map((comment) => (
				<Comment
					key={comment.id}
					user={comment.user}
					body={comment.body}
					comment_id={comment.comment_id}
					post_id={props.post_id}
					current_user={props.current_user}
					post_user={props.post_user}
					reload={props.reload}
				/>
			))}
		</div>
	);
};

export default CommentsList;