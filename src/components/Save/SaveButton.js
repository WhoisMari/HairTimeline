import React, { Fragment, useState } from "react";
import classes from './SaveButton.module.scss';
import SaveModal from "./SaveModal";

const SaveButton = (props) => {
	const [show, setShow] = useState(false);
	const isExplore = props.isExplore;
	const handleShow = () => {
		setShow(true);
	};
	const handleHide = () => {
		setShow(false);
	};

	return (
		<Fragment>
			{isExplore && <button className={classes['explore-save-btn']} onClick={handleShow}><i className="fa-solid fa-folder-open"></i> Save</button>}
			{!isExplore && <div className={classes['post-save-btn']} onClick={handleShow}>Save to <i className="fa-solid fa-angle-right"></i></div>}
			{show && 
				<SaveModal
					show={handleShow}
					onHide={handleHide}
					collections={props.collections}
					postId={props.postId}
				/>
			}
		</Fragment>
	);
};

export default SaveButton;