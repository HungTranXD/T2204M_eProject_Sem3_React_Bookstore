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
import {ProvinceProvider} from "./contexts/ProvinceContext";
import {CouponProvider} from "./contexts/CouponContext";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import {CLIENT_ID} from "./config";

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<CartProvider>
					<LoadingProvider>
						<CategoryProvider>
							<ProvinceProvider>
								<CouponProvider>
									<PayPalScriptProvider options={{ "client-id": CLIENT_ID }}>
										<Loading/>
										<div className="App">
											<Index />
											<ToastContainer/>
										</div>
									</PayPalScriptProvider>
								</CouponProvider>
							</ProvinceProvider>
						</CategoryProvider>
					</LoadingProvider>
				</CartProvider>
			</UserProvider>
		</AuthProvider>
	);
}

export default App;
