import React from 'react';
import './style.css';

import footer from '../../../../assets/images/footer.png';

import Button from '@material-ui/core/Button';


const Footer = () => (
  <div>
    <div className="footer-copyright">
      <Button id={"footerButton"} href="http://willings.co.jp/en/">
        Willings, Inc.
      </Button>
      <Button id="footerButton" href="https://willings.co.jp/en/contact">
        Contact Us
      </Button>
      {/* <img src={footer} alt="footer" height="100%" width="100%" /> */}
      <div className="cprtArea">
        <div id="cprtTxt">© 2019 Willings, Inc. All rights reserved.</div>
      </div>
    </div>
  </div>
);

export default Footer;