import React, { useState, useEffect, useCallback } from "react";
import './Filtering.scss';
import config from '../../config.json';
import Select from "react-select";
import makeAnimated from 'react-select/animated';

const FilterButton = (props) => {
	const [tagsOptions, setTagsOptions] = useState();
	const [colorsOptions, setColorsOptions] = useState();
	const [show, setShow] = useState(true);
	const animatedComponents = makeAnimated();
	const [colors, setColors] = useState([]);
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
			setColorsOptions(data.colors);
		} catch(error) {
			console.log(error);
		}
	}, []);

	const onColors = (color) => {
		let colors_list = colors;
		if (colors_list.includes(color.id)) {
			for(var i = 0; i < colors_list.length; i++){ 
				if ( colors_list[i] === color.id) { 
					colors_list.splice(i, 1); 
					i--;
				}
			}
		} else {
			colors_list.push(color.id)
		}
		setColors(colors_list);
		props.filter({"colors": colors, "tags": tags});
	};

	const onTags = (items) => {
		let tags_list = [];
		items.forEach(item => {
			tags_list.push(item.value);
		});
		setTags(tags_list)
		props.filter({"colors": colors, "tags": tags_list})
	};

	useEffect(() => {
		fetchFiltersHandler()
	}, [fetchFiltersHandler]);

	return (
		<div className='wrap-filtering'>
			<button className='filter-button' onClick={handleShow}><i className="fa-solid fa-filter"></i> Filters</button>
			{show === true && 
				<form>
					<div className='wrap-filters'>
						{colorsOptions &&
							<div>
								{colorsOptions.map((color) => (
									<label key={color.id} className="checkbox">
										<input 
											type="checkbox"
											onClick={() => onColors(color)}
											style={{ backgroundColor: color.hex }} 
										/>
										<span></span>
									</label>
								))}
							</div>
						}
						<div className='tags-filter'>
							<Select
								components={animatedComponents}
								options={tagsOptions}
								isMulti
								isLoading={props.selectLoading}
								onChange={onTags}
							/>
						</div>
					</div>
				</form>
			}
		</div>
	)
};

export default FilterButton;