import React from 'react';
import Index from './pages/Index';	

//Css 
import "./assets/css/style.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";
import {AuthProvider} from "./contexts/AuthContext";
import {UserProvider} from "./contexts/UserContext";
import {CartProvider} from "./contexts/CartContext";
import {LoadingProvider} from "./contexts/LoadingContext";
import Loading from "./layouts/Loading";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {CategoryProvider} from "./contexts/CategoryContext";

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<CartProvider>
					<LoadingProvider>
						<CategoryProvider>
							<Loading/>
							<div className="App">
								<Index />
								<ToastContainer/>
							</div>
						</CategoryProvider>
					</LoadingProvider>
				</CartProvider>
			</UserProvider>
		</AuthProvider>
	);
}

export default App;
