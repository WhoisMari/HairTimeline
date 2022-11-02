import React from "react";
import AsyncSelect from 'react-select/async';
import { useNavigate } from "react-router-dom";
import config from '../../config.json';

const SearchBar = (props) => {
	const navigate = useNavigate()
	const loadOptions = async (inputValue, callback) => {
		const options_list = []
		const response = await fetch(`${config.SERVER_URL}/get-users/?query=${inputValue}`, {method: 'GET'})
		const data = await response.json()
		data.map((user) => {
			return options_list.push({'value': user.id, 'label': user.username});
		})
		callback(options_list)
	}

	const handleChange = (item) => {
		navigate(`/${item.label}/`)
	}

	return (
		<AsyncSelect
			placeholder='Are you looking for someone?'
			onChange={handleChange}
			loadOptions={loadOptions}
		/>
	)
};

export default SearchBar;