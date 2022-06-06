import React from "react";
import CollectionForm from "../components/Collection/CollectionForm";
import classes from '../components/styles/Forms.module.scss';

const CreateCollectionPage = () => {
	return (
		<div className={classes['wrapper']}>
			<CollectionForm />
		</div>
	);
}

export default CreateCollectionPage;