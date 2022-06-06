import React from 'react';
import CollectionCard from './CollectionCard';
import classes from './CollectionsList.module.scss';

const CollectionsList = (props) => {
	return (
		<div className={classes['wrap-saved-cards']}>
			{props.collections.map((collection) => (
				<CollectionCard
					key={collection.id}
					title={collection.title}
					posts={collection.post}
				/>
			))}
		</div>
	);
};

export default CollectionsList;