import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import CommentBox from '../Comment/CommentBox';
import Likes from '../Like/Likes';
import SaveButton from '../Save/SaveButton';
import EditPostModal from './EditPostModal';
import config from '../../config.json';
import classes from './PostDetail.module.scss';

const PostDetail = (props) => {
	const postContainerRef = useRef()
	const actionToggleRef = useRef()

	const post = props.post;
	const user = props.user;
	const isAuth = props.isAuth;
	const [copied, setCopied] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [showActions, setShowActions] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [colors, setColors] = useState('');
	const [tags, setTags] = useState([]);
	const [defaultTags, setDefaultTags] = useState([]);
	const image_str = post.image;
	const post_image = image_str.substring(0, image_str.indexOf('?'));

	const handleCopyURL = () => {
		const el = document.createElement("input");
		el.value = window.location.href;
		document.body.appendChild(el);
		el.select();
		navigator.clipboard.writeText(el.value);
		document.body.removeChild(el);
		setCopied(true);
	};
	const handleShowInfo = () => {
		setShowActions(false)
		setShowInfo(!showInfo)
	};
	const handleShowActions = () => {
		setShowActions(!showActions)
		setCopied(false);
	};
	const handleShowModal = () => {
		setShowActions(false)
		let tags_list = [];
		if (post.tags !== []) {
			post.tags.forEach(tag => {
				tags_list.push({'value': tag.id, 'label': tag.title});
			});
		};
		setDefaultTags(tags_list)
		setShowModal(true)
	};
	const handleHideModal = () => {
		setShowModal(false)
	};
	const editPostHandler = (edited_post) => {
		setShowModal(false)
		fetch(`${config.SERVER_URL}/posts/edit/${post.id}/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(edited_post),
		})
		.then(res => res.json())
		.then((data) => {
			props.reload()
		});
	};
	const fetchCategoriesHandler = useCallback(async () => {
		const tags_list = [];
		try {
			const response = await fetch(`${config.SERVER_URL}/get-categories/`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('something went wrong');
			}
			const data = await response.json();
			setColors(data.colors)
			data.tags.forEach(tag => {
				tags_list.push({'value': tag.id, 'label': tag.title});
			});
			setTags(tags_list)
		} catch(error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		setShowEdit(false);
		if (user.id === props.current_user.pk) {
			fetchCategoriesHandler()
			setShowEdit(true);
		}
	}, [user.id, props.current_user.pk, fetchCategoriesHandler]);

	return (
		<div
			ref={postContainerRef}
			className={classes['post-container']}
			onClick={(e) => e.target === postContainerRef.current ? setShowActions(false) : false}
			onWheel={(e) => e.target === postContainerRef.current ? setShowActions(false) : false}
		>
			<div className={classes['wrap-post']}>
				<div className={classes['wrap-post-header']}>
					<div className={classes['post-header']}>
						<Link to={`/${user.username}/`} className={classes['username']}>
							<img src={user.profile_image ?
								(user.profile_image.substring(0, user.profile_image.indexOf('?'))) : ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
								alt='' />
							@{user.username}
						</Link>
						<div className={classes['post-actions']}>
							<Likes post_id={post.id} isAuth={isAuth} />
							<div className={classes['ellipsis']} onClick={handleShowActions} ref={actionToggleRef}>
								<i className="fa-solid fa-ellipsis"></i>
							</div>

							{showActions && 
								<div className={classes['more-actions']}>
									{showEdit &&
										<div className={classes['edit-icon']}>
											<span onClick={handleShowModal}>Edit <i className="fa-regular fa-pen-to-square"></i></span>
										</div>
									}
									<div className={classes['info-icon']}>
										<span onClick={handleShowInfo}>Products <i className="fas fa-palette"></i></span>
									</div>
									<div className={classes['copy-button']} onClick={handleCopyURL} title='Copy Post Link'>
										{!copied ? <span>Copy URL <i className="far fa-copy"></i> </span>: <span className={classes['copied-message']}>Copied!</span>}
									</div>
									{isAuth &&
										<div className={classes['save-button']}>
											<SaveButton isExplore={false} postId={post.id} />
										</div>
									}
								</div>
							}
						</div>
					</div>
					<div className={classes['post-caption']}>
						<div className={classes['caption']}>
							{post.caption}
						</div>
					</div>
				</div>
				<div className={classes['image-container']}>
					<img className={classes['post-image']} src={post_image} alt='' />
					{showInfo && 
						<div className={classes['post-info']}>
							<div className={classes['close-icon']} onClick={handleShowInfo}><i className="fas fa-times"></i></div>
							<div className={classes['info']}>
								<span>Products used for this look:</span>
								{post.products.length > 0 ? (
									<span>{post.products}</span>
								) : (
									<span>This user didn't list any products <i className="fa-regular fa-face-frown"></i></span>
								)}
							</div>
						</div>
					}
				</div>
				<CommentBox post_id={post.id} current_user={props.current_user} post_user={user} isAuth={props.isAuth} />
				{isAuth && 
					<EditPostModal
						show={showModal} 
						hide={handleHideModal} 
						post={post} 
						onEditPost={editPostHandler} 
						colors={colors} 
						tags={tags} 
						defaultTags={defaultTags}
					/>
				}
			</div>
		</div>
	);
};

export default PostDetail;