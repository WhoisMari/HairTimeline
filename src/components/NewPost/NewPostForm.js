import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../UI/Spinner';
import CropperModal from '../Cropper/CropperModal';
import { CirclePicker } from 'react-color';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import classes from '../styles/Forms.module.scss';

const NewPostForm = (props) => {
	const [errorMessage, setErrorMessage] = useState(false);
	const [caption, setCaption] = useState('');
	const [date, setDate] = useState('');
	const [image, setImage] = useState(null);
	const [products, setProducts] = useState('');
	const [show, setShow] = useState(false);
	const [imagePreview, setImagePreview] = useState('');
	const [colors, setColors] = useState('');
	const [tags, setTags] = useState([]);
	const animatedComponents = makeAnimated();

	const onChangePicture = e => {
		setImage(URL.createObjectURL(e.target.files[0]));
		setShow(true);
	};

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

	const croppedImage = (data) => {
		setImage(data.croppedImage)
		setImagePreview(data.imagePreview);
		setShow(false);
	};

	const submitFormHandler = (event) => {
		event.preventDefault();
		setErrorMessage(false);
		if (image === null) {
			setErrorMessage('Your post should have an image.');
			return;
		}
		if (date.trim() === '') {
			setErrorMessage('Your post should have a date.');
			return;
		}
		const post = new FormData()
		post.append('date', date);
		post.append('image', image, `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}.jpg`);
		post.append('caption', caption)
		post.append('products', products)
		post.append('colors', colors)
		post.append('tags', tags)
		props.onNewPost(post);
	};

	useEffect(() => {
		if (props.successMessage) {
			setImagePreview('');
			setDate('')
			setImage(null)
			setCaption('')
			setProducts('')
		};
	}, [props.successMessage]);

	return (
		<Fragment>
			<div className={classes['wrap-form']}>
				<h3 className={classes['page-title']}>Create new post</h3>
				<div className={classes['message']}>
					{props.successMessage && 
						<span className={classes['success']}>
							{props.successMessage} 
							You can check your new post <Link to={`/${props.user.username}/post/${props.newPost.id}/`}>here</Link>
						</span>
					}
					{errorMessage && <span className={classes['error']}>{errorMessage}</span>}
				</div>
				<form onSubmit={submitFormHandler}>
					<label htmlFor="image">Upload image *</label>
					<input
						className="form-control"
						type="file"
						id="image"
						onChange={onChangePicture}
						required
						accept="image/png, image/jpeg"
					/>
					<div className={classes['image-preview']}>
						<img src={imagePreview} alt='' />
					</div>
					<label htmlFor="date">When did you change your hair? *</label>
					<input
						className="form-control"
						type="date"
						id="date"
						required
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
						placeholder='Something like "I used Schwarzkopf Igora dye to get this silver colour, and then
						celeb luxury shampoos and conditioner to add the blues and purples onto the silver!"'
					/>
					<div className='row'>
						<div className='col-12 col-md-6'>
							<label htmlFor="hair_change">Add tags:</label>
							<Select
								components={animatedComponents}
								options={props.tags}
								isMulti
								onChange={onChangeTags}
							/>
						</div>
						<div className='col-12 col-md-6'>
							<label htmlFor="hair_change">Add colors:</label>
							<CirclePicker
								width={'100%'}
								colors={props.colors}
								onChange={onChangeColor}
							/>
						</div>
					</div>
					<button className={classes['primary-btn']}>Submit {props.isLoading && <Spinner isWhite={true} />}</button>
				</form>
			</div>
			<CropperModal
				imageURL={image}
				width={500}
				aspectRatio={NaN}
				show={show}
				onSave={croppedImage}
			/>
		</Fragment>
	);
};

export default NewPostForm;