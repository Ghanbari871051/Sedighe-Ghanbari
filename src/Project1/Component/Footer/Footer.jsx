import React from 'react';
import './FooterStyle.scss'

function Footer(props) {
  return (
    <div className='footer-component'>
      <footer>
        <div className="row">
          <div className="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">Home</a></li>
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">FAQs</a></li>
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">About</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">Home</a></li>
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">FAQs</a></li>
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">About</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">Home</a></li>
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">FAQs</a></li>
              <li className="nav-item mb-2"><a href="" className="nav-link p-0 text-muted">About</a></li>
            </ul>
          </div>

          <div className="col-md-5 offset-md-1 mb-3">
            <form>
              <h5>Subscribe to our newsletter</h5>
              <p>Monthly digest of what's new and exciting from us.</p>
              <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                <input id="newsletter1" type="text" className="form-control" placeholder="Email address" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
          <p>© 2022 Company, Inc. All rights reserved.</p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3"><a className="" href=""><i className="fa fa-arrow-up"></i> </a></li>
            <li className="ms-3"><a className="link-dark" href=""><i className='fa fa-facebook bi'></i> </a></li>
            <li className="ms-3"><a className="link-dark" href=""><i className='fa fa-twitter bi'></i> </a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;