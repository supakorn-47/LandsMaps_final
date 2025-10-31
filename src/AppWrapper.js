import React, { useEffect } from 'react';
import { Route, useLocation, withRouter } from 'react-router-dom';
import App from "./App";
import Login from "./pages/WebPortal/Login";
import Portal from "./pages/WebPortal/Portal";

const AppWrapper = () => {
	let location = useLocation();
	let seconds = 0;

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location]);
	
	const renderPage = () => {
		switch (location.pathname) {
			case "/":
				return <Route path="/" component={Login} />
			case "/login":
				return <Route path="/login" component={Login} />
			case "/portal":
				return <Route path="/portal" component={Portal} />
			default:
				return <App />;
		}
	}

	return (
		renderPage()
	)
}



export default withRouter(AppWrapper);
