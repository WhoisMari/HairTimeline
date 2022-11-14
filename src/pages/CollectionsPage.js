import React, { Fragment, useCallback, useEffect, useState } from "react";
import CollectionsList from "../components/Collection/CollectionsList";
import Container from 'react-bootstrap/Container';
import classes from '../components/Collection/CollectionsList.module.scss';
import Loading from '../components/UI/Loading';
import config from '../utils/config.json';

const CollectionsPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [collections, setCollections] = useState([]);

	const fetchCollectionsHandler = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${config.SERVER_URL}/collections/`, {
				method: 'GET',
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				}
			});
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const data = await response.json();
			setCollections(data);
		} catch (error) {
			console.log('An error ocurred');
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchCollectionsHandler();
	}, [fetchCollectionsHandler]);

	return (
		<Container className={classes['wrapper']}>
			{isLoading ? (<Loading/>) : 
			(
				<Fragment>
					<CollectionsList collections={collections} />
					{collections.length === 0 &&
						<div className={classes['collections-msg']}>
							<i className="fas fa-layer-group"></i>
							<span>No collections yet</span>
						</div>
					}
				</Fragment>
			)}
			
		</Container>
	);
};

export default CollectionsPage;