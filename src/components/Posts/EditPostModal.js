import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { GithubPicker } from 'react-color';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import classes from './EditPostModal.module.scss';

const EditPostModal = (props) => {
	const [caption, setCaption] = useState(props.post.caption);
	const [date, setDate] = useState(props.post.date);
	const [products, setProducts] = useState(props.post.products)
	const [colors, setColors] = useState(props.post.colors);
	const [tags, setTags] = useState([props.post.tags]);
	const animatedComponents = makeAnimated();

	const onChangeTags= (items) => {
		let tags_array = [];
		if (items.length >= 1) {
			items.forEach(tag => {
				tags_array.push(tag.value);
			});
		};
		setTags(tags_array);
	};
	const onChangeColor = (color) => {
		setColors(color.hex)
	};
	const submitFormHandler = (event) => {
		event.preventDefault();
		const edited_post = new FormData()
		edited_post.append('date', date);
		edited_post.append('caption', caption)
		edited_post.append('products', products)
		edited_post.append('tags', tags)
		edited_post.append('colors', colors)
		props.onEditPost(edited_post);
	};

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
						<GithubPicker
							width={'100%'}
							triangle={'hide'}
							colors={props.colors}
							onChange={onChangeColor}
						/>
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