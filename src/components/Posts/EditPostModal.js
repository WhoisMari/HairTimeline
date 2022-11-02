import React, { useState, Fragment, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import classes from './EditPostModal.module.scss';

const EditPostModal = (props) => {
	const [caption, setCaption] = useState(props.post.caption);
	const [date, setDate] = useState(props.post.date);
	const [products, setProducts] = useState(props.post.products)
	const [colors, setColors] = useState([]);
	const [tags, setTags] = useState([]);
	const animatedComponents = makeAnimated();

	const onChangeTags= (items) => {
		let tags_list = [];
		if (items.length >= 1) {
			items.forEach(tag => {
				tags_list.push(tag.value);
			});
		};
		setTags(tags_list);
	};
	const onChangeColor = (color) => {
		let colors_list = colors;
		if (colors_list.includes(color.id)) {
			for(var i = 0; i < colors_list.length; i++){ 
				if ( colors_list[i] === color.id) { 
					colors_list.splice(i, 1); 
					i--;
				}
			}
		} else {
			colors_list.push(color.id);
		}
		setColors(colors_list);
	};

	const submitFormHandler = (event) => {
		event.preventDefault();
		const edited_post = {
			date: date,
			caption: caption,
			products: products,
			tags: tags,
			colors: colors,
		};
		props.onEditPost(edited_post);
	};

	useEffect(() => {
		let default_colors = []
		props.post.colors.forEach((color) => {
			default_colors.push(color.id)
		})
		setColors(default_colors)
		let default_tags = []
		props.defaultTags.forEach((tag) => {
			default_tags.push(tag.value)
		})
		setColors(default_colors)
		setTags(default_tags)
	}, [props.post.colors, props.defaultTags])

	return (
		<Modal
			show={props.show}
			onHide={props.hide}
		>
			<Modal.Header>
				<Modal.Title>
					Edit Post
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className={classes['wrap-edit-post-form']}>
					<form onSubmit={submitFormHandler}>
						<label htmlFor="date">When did you change your hair?</label>
						<input
							className="form-control"
							type="date"
							id="date"
							value={date}
							onChange={e => setDate(e.target.value)}
						/>
						<label htmlFor='caption'>Caption</label>
						<textarea 
							className="form-control"
							type='text'
							id='caption'
							value={caption}
							onChange={e => setCaption(e.target.value)}
						/>
						<label htmlFor='products'>Products</label>
						<textarea 
							className="form-control"
							type='text'
							id='products'
							value={products}
							onChange={e => setProducts(e.target.value)}
						/>
						<label htmlFor="hair_change">Add tags:</label>
						<Select
							defaultValue={props.defaultTags}
							components={animatedComponents}
							options={props.tags}
							isMulti
							onChange={onChangeTags}
						/>
						<label htmlFor="hair_change">Add colors:</label>
						{props.colors && 
						<Fragment>
							<div>
								{props.colors.map((color) => (
									<label key={color.id} className={classes["checkbox"]}>
										<input
											defaultChecked={props.post.colors.find(a => a.id === color.id) ? true : null}
											type="checkbox"
											onChange={() => onChangeColor(color)}
											style={{ backgroundColor: color.hex }} 
										/>
										<span></span>
									</label>
								))}
							</div>
						</Fragment>
						}
					</form>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<button className={classes['primary-btn']} onClick={submitFormHandler}>Submit</button>
				<button className={classes['primary-btn']} onClick={props.hide}>Close</button>
			</Modal.Footer>
		</Modal>
	);
};

export default EditPostModal;