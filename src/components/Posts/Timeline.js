import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TimelinePost from'./TimelinePost';
import Loading from '../UI/Loading';
import config from '../../config.json';
import Container from 'react-bootstrap/Container'
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../UI/Spinner';
import { VerticalTimeline }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import classes from './Timeline.module.scss';
import Moment from 'moment';

const Timeline = (props) => {
	Moment.locale('en');

	const [posts, setPosts] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const isHomePage = props.isHomePage;
	const current_user = props.current_user;
	const [page, setPage] = useState(1);
	const [hasNext, setHasNext] = useState(false);

	const infiniteScrollLoader = (
		<div className={classes['timeline-spinner']}><Spinner isWhite={false} /></div>
	);

	const infiniteScrollEndMessage = (
		<div className={classes['end-message']}>
			<h4>You're All Caught Up</h4>
			<div>You've seen all posts.</div>
		</div>
	);

	const loadMore = () => {
		fetch(`${config.SERVER_URL}/posts/timeline/${props.userId}/?page=${page}`, {
			method: 'GET',
		})
		.then(res => res.json())
		.then((data) => {
			setPosts(prevPosts => [...prevPosts, ...data.posts]);
			setHasNext(data.has_next)
			if (hasNext) {
				setPage(page+1)
			};
		});
	};

	const fetchPostsHandler = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${config.SERVER_URL}/posts/timeline/${props.userId}/?page=1`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const data = await response.json();
			const loadedPosts = [];
			for (const key in data.posts) {
				loadedPosts.push({
					id: key,
					user: data.posts[key].user,
					caption: data.posts[key].caption,
					image: data.posts[key].image,
					date: data.posts[key].date,
					post_id: data.posts[key].id
				});
			}
			setPosts(loadedPosts);
			setHasNext(data.has_next)
			setPage(p=>p+1)
			setUser(loadedPosts[0].user)

		} catch (error) {
			return;
		}
		setIsLoading(false);
	}, [props.userId]);

	useEffect(() => {
		fetchPostsHandler();
	}, [fetchPostsHandler]);


	return (
		<Container>
			{isLoading && posts === null && <Loading />}
			{posts!== null && posts.length === 0 &&
				<div className={classes['timeline-msg']}>
					<i className="fa-solid fa-camera"></i>
					<span>No posts yet</span>
					{isHomePage && 
						<div>Start your timeline <Link to='/create-new-post/'>here!</Link></div>
					}
				</div>
			}
			{!isLoading && posts !== null &&
				<InfiniteScroll
					dataLength={posts.length}
					next={loadMore}
					hasMore={hasNext}
					loader={infiniteScrollLoader}
					endMessage={(posts.length >= 1 ? infiniteScrollEndMessage : '')}
				>
					<VerticalTimeline lineColor={user.cover_color ? user.cover_color : '#6363ad'}>
						{posts.map((post) => (
							<TimelinePost
								key={post.id}
								user={user}
								post={post}
								current_user={current_user}
								reload={fetchPostsHandler}
							/>
						))}
					</VerticalTimeline>
				</InfiniteScroll>
			}
		</Container>
	);
};

export default Timeline;