import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal/';
import Loading from '../UI/Loading';
import CropperModal from '../Cropper/CropperModal';
import config from '../../utils/config.json';
import colors from '../../utils/coverColors.json';
import classes from './ProfileForm.module.scss';

const ProfileForm = (props) => {
	const [firstName, setFirstName] = useState(props.user.first_name);
	const [lastName, setLastName] = useState(props.user.last_name);
	const [about, setAbout] = useState(props.user.about);
	const [coverColor, setCoverColor] = useState(props.user.cover_color);
	const [profileImage, setProfileImage] = useState(null);


	const [isLoading, setIsLoading] = useState(false);
	const [charCounter, setCharCounter] = useState(0);
	const [error, setError] = useState('');
	const [show, setShow] = useState(false);
	const [imageURL, setImageURL] = useState(null);
	const [width, setWidth] = useState(null);
	const [aspectRatio, setAspectRatio] = useState(null);
	const [imageView, setImageView] = useState(null);

	const onChangeProfileImg = (e) => {
		setImageURL(URL.createObjectURL(e.target.files[0]));
		setWidth(400)
		setAspectRatio(1/1)
		setImageView('Profile')
		setShow(true);
	};

	const croppedImage = (data) => {
		if (data.imageView === 'Profile') {
			setProfileImage(data.croppedImage)
		}
		setShow(false);
	}

	const onChangeAbout = (e) => {
		setCharCounter(e.target.value.length);
		if (charCounter <= 150) {
			setError('');
			setAbout(e.target.value);
		} else {
			setError('the max characters is 150');
		}
	};

	const submitFormHandler = (event) => {
		event.preventDefault();
		if (about.length > 150) {
			setError("Max characters for your about is 150.")
			return
		}
		setIsLoading(true);
		const newUserInfo = new FormData()
		newUserInfo.append('about', about)
		newUserInfo.append('is_active', true);
		if (profileImage !== null) {
			newUserInfo.append('profile_image', profileImage, `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}.png`);
		};
		newUserInfo.append('cover_color', coverColor);
		newUserInfo.append('email', props.user.email);
		newUserInfo.append('username', props.user.username);

		fetch(`${config.SERVER_URL}/user/${props.user.username}/`, {
			method: 'PUT',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
			body: newUserInfo,
		})
		.then(res => res.json())
		.then(() => {
			props.onEditProfile()
		});
	};

	return (
		<Modal show={props.handleShow} onHide={props.handleShow} size='lg'>
			<Modal.Header>
				<Modal.Title>Edit Profile</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{isLoading && <Loading />}
				{!isLoading &&
					<form className={classes['wrap-form']}>
						<label htmlFor="first-name">First name</label>
						<input
							id='first-name'
							className="form-control"
							type="text"
							value={firstName}
							onChange={e => setFirstName(e.target.value)}
						/>
						<label htmlFor="last-name">Last name</label>
						<input
							id='last-name'
							className="form-control"
							type="text"
							value={lastName}
							onChange={e => setLastName(e.target.value)}
						/>
						<label htmlFor='about'>About (characters: {charCounter} out of 150)</label>
						<textarea 
							className="form-control"
							type='text'
							id='about'
							value={about}
							onChange={e => onChangeAbout(e)}
						/>
						<label htmlFor="cover-image">Cover Color</label>
						<div>
							{colors.colors.map((color) => (
								<label key={color.id} className={classes["checkbox"]}>
									{console.log(coverColor)}
									<input
										onChange={() => setCoverColor(`${color.hex}-${color.hsl}`)}
										checked={color.hex === coverColor.split('-')[0] ? true : false}
										type="checkbox"
										style={{ backgroundColor: color.hex }} 
									/>
									<span></span>
								</label>
							))}
						</div>
						<label htmlFor="profile-image">Profile Image</label>
						<input
							className="form-control"
							type="file"
							id="profile-image"
							onChange={onChangeProfileImg}
							accept="image/png, image/jpeg"
						/>
					</form>
				}
				{error && <p>{error}</p>}
				<CropperModal 
					imageURL={imageURL}
					width={width}
					aspectRatio={aspectRatio}
					imageView={imageView}
					show={show}
					onSave={croppedImage}
				/>
			</Modal.Body>
				<Modal.Footer>
				<button className={classes['primary-btn']} onClick={submitFormHandler}>Save</button>
				<button className={classes['primary-btn']} onClick={props.handleShow}>Close</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ProfileForm;