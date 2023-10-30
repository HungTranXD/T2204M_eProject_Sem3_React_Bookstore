import React,{useState} from 'react';
//import emailjs from '@emailjs/browser';
import {Link} from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';
import {useCategories} from "../contexts/CategoryContext";
//images

//import logo from './../assets/images/logo.png';

function heartToggle(){
 	var  heartBlaste = document.querySelector('.heart');
 	if(heartBlaste){
		heartBlaste.classList.toggle("heart-blast");			
 	}	
}

//function slideDown(el) {
//	console.log(el);
//	const elem = document.getElementById(el);
//	console.log(elem);
//	document.getElementById("myH1").style.color = "red";
//	elem.style.transition = "all 2s ease-in-out";
//	//elem.style.height = "400px";
//}


function Footer({footerChange, logoImage}){
	//const [open, setOpen] = useState(false);
	const [accordBtn, setAccordBtn] = useState();
	const categories = useCategories();

	function renderCategoriesList(categories) {
		return (
			<>
				{categories.map((category) => (
					<React.Fragment key={category.id}>
						<li><Link>{category.name}</Link></li>
						{category.subCategories.length > 0 &&
							renderCategoriesList(category.subCategories)}
					</React.Fragment>
				))}
			</>
		);
	}

	return(
		<>
			<footer className={`site-footer ${footerChange}`}>				
				<div className="footer-category">
					<div className="container">
						<div className="category-toggle">
							<Link to={"#"} className={`toggle-btn ${accordBtn ? 'active' : ''}`}
								onClick={() => setAccordBtn(!accordBtn)}
							>All categories</Link>
							<div className="toggle-items row">
								<Collapse in={accordBtn} className="footer-col-book">
									<ul>
										{categories.map((category, id)=>(
											<React.Fragment key={id}>
												<li className="w-100 fw-bold border-bottom"><Link>{category.name}</Link></li>
												{category.subCategories.length > 0 &&
													renderCategoriesList(category.subCategories)}
											</React.Fragment>

										))}
									</ul>
								</Collapse>
							</div>
						</div>
					</div>
				</div>				
				<div className="footer-top">
					<div className="container">
						<div className="row">
							<div className="col-xl-3 col-lg-12 wow fadeInUp" data-wow-delay="0.1s">
								<div className="widget widget_about">
									<div className="footer-logo logo-white">
										<Link to={""}><img src={logoImage} alt="" /></Link> 
									</div>
									<p className="text">Shradha-Book is a official website of Shradha General Book Store</p>
									<div className="dz-social-icon style-1">
										<ul>
											<li><a href="https://www.facebook.com/dexignzone" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
											<li><a href="https://www.youtube.com/channel/UCGL8V6uxNNMRrk3oZfVct1g" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube"></i></a></li>
											<li><a href="https://www.linkedin.com/showcase/3686700/admin/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a></li>
											<li><a href="https://www.instagram.com/website_templates__/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a></li>
										</ul>
									</div>
								</div>
							</div>
							<div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4 wow fadeInUp" data-wow-delay="0.2s">
								<div className="widget widget_services">
									<h5 className="footer-title">Our Links</h5>
									<ul>
										<li><Link to={"/about-us"}>About us</Link></li>
										<li><Link to={"/contact-us"}>Contact us</Link></li>
										<li><Link to={"/privacy-policy"}>Privacy Policy</Link></li>
										<li><Link to={"/faq"}>FAQ</Link></li>
									</ul>
								</div>
							</div>
							<div className="col-xl-2 col-lg-3 col-sm-4 col-4 wow fadeInUp" data-wow-delay="0.3s">
								<div className="widget widget_services">
									<h5 className="footer-title">ShradhaBook</h5>
									<ul>
										<li><Link to={"/"}>Home</Link></li>
										<li><Link to={"/services"}>Services</Link></li>
										<li><Link to={"/books-grid-view-sidebar"}>Books & Other</Link></li>
										<li><Link to={"/blog-large-sidebar"}>Blogs</Link></li>
									</ul>
								</div>
							</div>
							<div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4 wow fadeInUp" data-wow-delay="0.4s">
								<div className="widget widget_services">
									<h5 className="footer-title">Resources</h5>
									<ul>
										<li><Link to={"/order-tracking"}>Order Tracking</Link></li>
										<li><Link to={"/help-desk"}>Help Center</Link></li>
										<li><Link to={"/shop-login"}>Login</Link></li>
										<li><Link to={"/about-us"}>Partner</Link></li>
									</ul>
								</div>
							</div>
							<div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 wow fadeInUp" data-wow-delay="0.5s">
								<div className="widget widget_getintuch">
									<h5 className="footer-title">Get in Touch With Us</h5>
									<ul>
										<li>
											<i className="flaticon-placeholder"></i>
											<span>8 Ton That Thuyet, My Dinh 2, Hanoi, Vietname</span>
										</li>
										<li>
											<i className="flaticon-phone"></i>
											<span>+123 34567 890<br/>
											+123 34567 890</span>
										</li>
										<li>
											<i className="flaticon-email"></i> 
											<span>support@sharadha.com<br/>
											info@sharadha.com</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

			</footer>			
		</>
	)
}
export default Footer;