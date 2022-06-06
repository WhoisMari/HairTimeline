import React from 'react';
import Timeline from '../components/Posts/Timeline';
import classes from '../components/Posts/Timeline.module.scss';

const Home = (props) => {
	return (
		<div className={classes['wrapper']}>
			<Timeline userId={props.userId} current_user={props.current_user} isHomePage={true} />
		</div>
	);
}

export default Home;