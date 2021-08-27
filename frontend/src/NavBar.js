import 'bulma/css/bulma.min.css';
import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

function NavBar({ setUserId, setIsLogined, isLogined }) {
	const [clicked, setClicked] = useState(false);

    const onLogoutClicked = () => {
        setIsLogined(false);
        setUserId('');
        setClicked('');
        localStorage.clear();
    };

    const onLinkClicked = () => setClicked(false);

	return (
		<nav className="navbar mb-4" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					<h1 className="header">Simple Board</h1>
				</Link>

				<span role="button" className={'navbar-burger ' + (clicked ? 'is-active' : '')} aria-label="menu" aria-expanded="false" onClick={() => setClicked(!clicked)}>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</span>
			</div>

			<div id="navbarBasicExample" className={'navbar-menu ' + (clicked ? 'is-active' : '')}>
				<div className="navbar-start"></div>
				<div className="navbar-end">
					<div className="navbar-item">
						<div className="buttons">
							{!isLogined ? (
								<>
									<Link to="/signup" className="button is-primary" onClick={onLinkClicked}>
										<strong>Sign up</strong>
									</Link>
									<Link to="/login" className="button is-light" onClick={onLinkClicked}>
										Log in
									</Link>
								</>
							) : (
                                <>
                                <Link to="/write" className="button is-primary" onClick={onLinkClicked}>
										<strong>Write</strong>
								</Link>
								<button className="button is-light" onClick={onLogoutClicked}>
										Log Out
								</button>
                                </>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default NavBar;
