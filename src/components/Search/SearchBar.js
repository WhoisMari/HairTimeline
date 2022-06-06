import React, { useEffect, useCallback, useState } from "react";
import Select from 'react-select';
import classes from './SearchBar.module.scss';
import config from '../../config.json';

const SearchBar = (props) => {
	const [options, setOptions] = useState([]);
	const fetchUsersHandler = useCallback(async () => {
		let user_options = [];
		try {
			const response = await fetch(`${config.SERVER_URL}/get-users/`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('something went wrong');
			}
			const data = await response.json();
			data.forEach((user) => {
				user_options.push({'value': user.id, 'label': user.username});
			});
			setOptions(user_options);
		} catch(error) {
			console.log(error);
		}
	}, []);

	const handleChange = (newValue) => {
		window.location.replace(`/${newValue.label}/`);
	};

	useEffect(() => {
		fetchUsersHandler();
	}, [fetchUsersHandler]);

	return (
		<div className={classes['wrap-search-bar']}>
			<Select
				className={classes['wrap-select']}
				isSearchable={true}
				options={options}
				onChange={handleChange}
				placeholder={props.placeholder}
			/>
		</div>
	)
};

export default SearchBar;