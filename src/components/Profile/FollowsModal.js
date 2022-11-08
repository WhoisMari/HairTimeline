import React, { Fragment } from 'react';
import Modal from 'react-bootstrap/Modal/';
import { Link } from 'react-router-dom';
import noprofile from '../UI/noprofile.png';
import classes from './FollowsModal.module.scss';

const FollowsModal = (props) => {
	const action = props.handleShow.action
	const data = action === 'followers' ? props.followers : action === 'following' ? props.following : null
	return (
		<Modal scrollable={true} centered show={props.handleShow.show} onHide={props.close}>
			<Modal.Header closeButton>
				<Modal.Title className={classes['title']}>{action}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{data &&
					<>
						{data.length > 0 ? (
							<>
							{data.map((follow) => (
								<div key={follow.id} className={classes['follow']}>
									<Link to={`/${follow.username}/`}>
										<img src={follow.profile_image ? (
											follow.profile_image.substring(0, follow.profile_image.indexOf('?')) 
											) : (noprofile)}
											alt={follow.username}
										/>
										<div>
											<strong>{follow.username}</strong>
										</div>
									</Link>
								</div>
							))}
							</>
						) : (
							<span>This user does not {action === 'followers' ? 'have any followers yet.' : action =='following' ? 'follow anyone yet.' : ''}</span>
						)}
					</>
				}
			</Modal.Body>
		</Modal>
	);
};

export default FollowsModal;