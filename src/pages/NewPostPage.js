import { useState, useCallback, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container';
import NewPostForm from '../components/NewPost/NewPostForm';
import classes from '../components/styles/Forms.module.scss';
import config from '../config.json';

const NewPostPage = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [newPost, setNewPost] = useState(null);
	const [colors, setColors] = useState([]);
	const [tags, setTags] = useState('');
	const [errors, setErrors] = useState(false);

	const fetchCategoriesHandler = useCallback(async () => {
		const colors_list = [];
		const tags_list = [];
		try {
			const response = await fetch(`${config.SERVER_URL}/get-categories/`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('something went wrong');
			}
			const data = await response.json();
			data.colors.forEach(color => {
				colors_list.push(color.hex);
			});
			setColors(colors_list)
			data.tags.forEach(tag => {
				tags_list.push({'value': tag.id, 'label': tag.title});
			});
			setTags(tags_list)
		} catch(error) {
			console.log(error);
		}
	}, []);

	const newPostHandler = (post) => {
		setIsLoading(true);
		setSuccessMessage('');
		setErrors(false)
		fetch(`${config.SERVER_URL}/posts/create/`, {
			method: 'POST',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
			body: post,
		})
		.then(res => res.json())
		.then((data) => {
			if (!data.error) {
				setNewPost(data)
				setSuccessMessage('Post created successfully!')
			} else {
				setErrors(data.error)
			}
			setIsLoading(false);
		});
	};

	useEffect(() => {
		fetchCategoriesHandler()

	}, [fetchCategoriesHandler,])
	

	return (
		<Container className={classes['wrapper']}>
			<span>{errors}</span>
			<NewPostForm 
				onNewPost={newPostHandler} 
				isLoading={isLoading} 
				successMessage={successMessage} 
				newPost={newPost} 
				user={props.current_user}
				colors={colors}
				tags={tags}
			/>
		</Container>
	);
};

export default NewPostPage;