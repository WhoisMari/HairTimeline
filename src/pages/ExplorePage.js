import React, { useCallback, useState, useEffect } from 'react';
import Loading from '../components/UI/Loading';
import Masonry from '../components/Posts/Masonry';
import Container from 'react-bootstrap/Container';
import classes from '../components/Posts/Masonry.module.scss';
import FilterButton from '../components/Filtering/FilterButton';
import config from '../utils/config.json';
import Spinner from '../components/UI/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

const ExplorePage = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [posts, setPosts] = useState(null);
	const [page, setPage] = useState(1);
	const [hasNext, setHasNext] = useState(false);
	const [selectLoading, setSelectLoading] = useState(false);
	const [filters, setFilters] = useState('');
	const isAuth = props.isAuth;

	const infiniteScrollLoader = (
		<div className={classes['explore-spinner']}><Spinner isWhite={false} /></div>
	);

	const infiniteScrollEndMessage = (
		<div className={classes['end-message']}>
			<h4>You're All Caught Up</h4>
			<div>You've seen all posts.</div>
		</div>
	);

	const loadMore = () => {
		fetch(`${config.SERVER_URL}/posts/explore/?page=${page}&filters=${filters}`, {
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

	const filterHandler = (filter_list) => {
		setSelectLoading(true);
		setFilters(filter_list);
		fetch(`${config.SERVER_URL}/posts/explore/?page=1&tags=${filter_list['tags']}&colors=${filter_list['colors']}`, {
			method: 'GET',
		})
		.then(res => res.json())
		.then((data) => {
			setPosts(data.posts);
			setHasNext(data.has_next)
			setSelectLoading(false);
		});
	};

	const fetchExploreHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`${config.SERVER_URL}/posts/explore/?page=1`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}
			const data = await response.json();
			setPosts(data.posts);
			setHasNext(data.has_next)
			setPage(p=>p+1)
		} catch (error) {
			setError('No posts yet!');
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchExploreHandler();
	}, [fetchExploreHandler]);

	return (
		<Container className={classes['wrapper']}>
			{isLoading && <Loading />}
			{!isLoading && posts !== null &&
				<div>
					<FilterButton filter={filterHandler} selectLoading={selectLoading} />
					<InfiniteScroll
						dataLength={posts.length}
						next={loadMore}
						hasMore={hasNext}
						loader={infiniteScrollLoader}
						endMessage={(posts.length >= 1 ? infiniteScrollEndMessage : '')}
					>
						<Masonry posts={posts} isAuth={isAuth} />
					</InfiniteScroll>
				</div>
				
			}
			{posts !==  null && posts.length === 0 &&
				<div className={classes['explore-msg']}>
					<i className="fa-solid fa-camera"></i>
					<span>No posts yet</span>
				</div>
			}
			{error && <span>{error}</span>}
		</Container>
		
	);
};

export default ExplorePage;