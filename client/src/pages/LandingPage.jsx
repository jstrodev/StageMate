import React from 'react';
import { Link } from "react-router-dom";
import StageMateLogo from '../public/StageMateLogo.png'; // Adjust the path as necessary

const LandingPage = () => {
  return (
	<div
	  className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
	  style={{
		backgroundImage: `url(${StageMateLogo})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat'
	  }}
	>
	  <h1 className="text-4xl font-bold mb-6">Welcome to StageMate</h1>
	  <p className="text-lg mb-4">Your music venue journey starts here.</p>
	  <div className="flex space-x-4">
		<Link
		  to="/register"
		  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
		>
		  Register
		</Link>
		<Link
		  to="/home"
		  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
		>
		  Homepage
		</Link>
	  </div>
	</div>
  );
};

export default LandingPage;