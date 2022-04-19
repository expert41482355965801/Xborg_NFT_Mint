import React from 'react'
import { FaTwitter } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

export default function Footer () {
	return(
		<section id="footer">
			<div className='social-icon'><FaTwitter /></div>
			<div className='social-icon'><FaTelegram /></div>
			<div className='social-icon'><FaDiscord /></div>
		</section>
	);
}