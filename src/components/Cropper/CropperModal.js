import React, { useEffect, useState } from "react";
import Cropper from 'cropperjs';
import Modal from 'react-bootstrap/Modal/';
import classes from '../styles/Forms.module.scss';

const CropperModal = (props) => {
	let cropper;
	let canvas;
	const [croppedImage, setCroppedImage] = useState('');
	const [imagePreview, setImagePreview] = useState('');

	const handleSave = () => {
		canvas = cropper.getCroppedCanvas({
			width: props.width,
			imageSmoothingEnabled: false,
			imageSmoothingQuality: 'high',
		});
		setImagePreview(canvas.toDataURL())
		canvas.toBlob((blob) => {
			const image_object = new File([blob], 'image.jpeg', {
				type: blob.type,
			});
			setCroppedImage(image_object)
		})
	}

	useEffect(() => {
		if (props.imageURL !== null && props.show === true) {
			setCroppedImage('')
			const picture = document.getElementById('picture')
			cropper = new Cropper(picture, {
				aspectRatio: props.aspectRatio,
				viewMode: 2,
			});
		}
		if (croppedImage !== '') {
			props.onSave({'croppedImage': croppedImage, 'imagePreview': imagePreview, 'imageView': props.imageView})
		};
	}, [props.imageURL, props.show, croppedImage]);

	return (
		<Modal show={props.show} onHide={handleSave} backdrop="static">
			<Modal.Header>
				<Modal.Title>Crop</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className={classes['cropper-wrapper']}>
					<img className={classes['img-preview']} id="picture" src={props.imageURL} alt='' />
				</div>
			</Modal.Body>
			<Modal.Footer>
				<button className={classes['primary-btn']} onClick={handleSave}>Save</button>
				<button className={classes['primary-btn']} onClick={handleSave}>Close</button>
			</Modal.Footer>
		</Modal>
	)
};

export default CropperModal;