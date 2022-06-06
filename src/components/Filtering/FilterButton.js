import React, { useState, useEffect, useCallback } from "react";
import classes from './Filtering.module.scss';
import config from '../../config.json';
import { GithubPicker } from 'react-color';
import Select from "react-select";
import makeAnimated from 'react-select/animated';

const FilterButton = (props) => {
	const [tagsOptions, setTagsOptions] = useState();
	const [colorsOptions, setColorsOptions] = useState();
	const [show, setShow] = useState(false);
	const animatedComponents = makeAnimated();
	const [colors, setColors] = useState('')
	const [tags, setTags] = useState([]);

	const handleShow = () => {
		setShow(!show)
	};

	const fetchFiltersHandler = useCallback(async () => {
		try {
			const response = await fetch(`${config.SERVER_URL}/get-categories/`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}
			const data = await response.json();
			let tags_list = [];
			data.tags.forEach(tag => {
				tags_list.push({'value': tag.id, 'label': tag.title});
			});
			setTagsOptions(tags_list);
			let colors_list = [];
			data.colors.forEach(color => {
				colors_list.push(color.hex)
			});
			setColorsOptions(colors_list);
		} catch(error) {
			console.log(error);
		}
	}, []);

	const onColors = (color) => {
		setColors(color.hex.substring(color.hex.indexOf('#') + 1))
	};

	const onTags = (items) => {
		let tags_list = [];
		items.forEach(item => {
			tags_list.push(item.value);
		});
		setTags(tags_list)
	};

	const clearColors = () => {
		setColors('');
	};

	const handleFilters = () => {
		props.filter({"color": colors, "tags": tags})
	};

	useEffect(() => {
		fetchFiltersHandler()
	}, [fetchFiltersHandler]);

	return (
		<div className={classes['wrap-filtering']}>
			<button className={classes['filter-button']} onClick={handleShow}><i className="fa-solid fa-filter"></i> Filters</button>
			{show === true && 
				<form>
					<div className={`${classes['wrap-filters']} row`}>
						<div className={`${classes['tags-filter']} col-12 col-md-6`}>
							<Select
								components={animatedComponents}
								options={tagsOptions}
								isMulti
								isLoading={props.selectLoading}
								onChange={onTags}
							/>
						</div>
						<div className="col-12 col-md-6">
							<GithubPicker
								width={'100%'}
								colors={colorsOptions}
								triangle={'hide'}
								onChangeComplete={onColors}
							/>
						</div>
					</div>
					<div className={classes['actions']}>
						<div className={classes['clear-btn']} onClick={clearColors}>Clear Colors</div>
						<div className={classes['filter-btn']} onClick={handleFilters}>Filter</div>
					</div>
					
				</form>
			}
		</div>
	)
};

export default FilterButton;