import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

import Layout from './components/Layout/Layout';
import ProfilePage from './pages/ProfilePage';
import NewPostPage from './pages/NewPostPage';
import Home from './pages/Home';
import CollectionsPage from './pages/CollectionsPage';
import CreateCollectionPage from './pages/CreateCollectionPage';
import ExplorePage from './pages/ExplorePage';
import Collection from './components/Collection/Collection';
import AccountPage from './pages/AccountPage';
import PostPage from './pages/PostPage';
import config from './config.json';
import AuthPage from './pages/AuthPage';

function App() {
	const [isAuth, setIsAuth] = useState(false);
	const [user, setUser] = useState('');
	const [userId, setUserId] = useState('');
	const authToken = localStorage.getItem('token');
	const [didMount, setDidMount] = useState(false); 

	useEffect(() => {
		if (authToken !== null) {
			setIsAuth(true);
			fetch(`${config.SERVER_URL}/v1/users/auth/user/`, {
				method: 'GET',
				headers: {
					Authorization: `Token ${authToken}`
				},
			})
			.then(res => res.json())
			.then(data => {
				setUser(data);
				setUserId(data.pk);
			});
		}
		setDidMount(true);
		return () => setDidMount(false);
	}, [authToken]);

	if(!didMount) {
		return null;
	}

	return (
		<div className='App'>
			<BrowserRouter>
				<Layout current_user={user} />
				{isAuth ? (
					<Routes>
						<Route path='/' exact element={<Home userId={userId} current_user={user} />} />
						<Route path='/create-new-post/' exact element={<NewPostPage current_user={user} />} />
						<Route path='/:username/' exact element={<ProfilePage current_user={user} isAuth={isAuth} />} />
						<Route path='/:username/post/:postId/' exact element={<PostPage current_user={user} isAuth={isAuth} />} />
						<Route path='/new-collection/' exact element={<CreateCollectionPage />} />
						<Route path='/collections/' exact element={<CollectionsPage />} />
						<Route path='/collections/:collection_title/' exact element={<Collection />} />
						<Route path='/explore/' exact element={<ExplorePage isAuth={isAuth} />} />
						<Route path='/account/' exact element={<AccountPage />} /> 
					</Routes>
				) : (
					<Routes>
							<Route path='/' exact element={<ExplorePage isAuth={isAuth} />} />
							<Route path='/create-new-post/' exact element={<AuthPage isLogin={true} />} />
							<Route path='/:username/' exact element={<ProfilePage current_user={false} isAuth={isAuth} />} />
							<Route path='/:username/post/:postId/' exact element={<PostPage current_user={false} isAuth={isAuth} />} />
							<Route path='/new-collection/' exact element={<AuthPage isLogin={true} />} />
							<Route path='/collections/' exact element={<AuthPage isLogin={true} />} />
							<Route path='/collections/:collection_title/' exact element={<AuthPage isLogin={true} />} />
							<Route path='/explore/' exact element={<ExplorePage isAuth={isAuth} />} />
							<Route path='/account/' exact element={<AuthPage isLogin={true} />} /> 
							<Route path='/login/' exact element={<AuthPage isLogin={true} />} />
							<Route path='/signup/' exact element={<AuthPage isLogin={false} />} />
					</Routes>
				)}
			</BrowserRouter>
		</div>
	);
}

export default App;