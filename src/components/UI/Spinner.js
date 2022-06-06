import React, { Fragment } from 'react';

import classes from './Spinner.module.scss';

const Spinner = (props) => {
	return (
		<Fragment>
			{props.isWhite ? (
				<div className={classes["loading"]}></div>
			) : (
				<div className={`${classes["loading"]} ${classes["purple"]}`}></div>
			)}
		</Fragment>
	);
};

export default Spinner;