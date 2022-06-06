import React from 'react';

import classes from './Loading.module.scss';

const Loading = () => {
	return (
		<div className={classes["loader-wrapper"]}>
			<div className={classes["loader"]}>
			<div className={classes["dot"]}></div>
			<div className={classes["dot"]}></div>
			<div className={classes["dot"]}></div>
			<div className={classes["dot"]}></div>
			<div className={classes["dot"]}></div>
			<div className={classes["dot"]}></div>
			</div>
		</div>
	);
};

export default Loading;