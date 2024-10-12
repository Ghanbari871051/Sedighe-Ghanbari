import React, { useEffect } from 'react';
import './ProfileHeaderStyle.scss'
import Logout from '../Logout/Logout';
import { faker } from '@faker-js/faker';
import { Link } from 'react-router-dom'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';

function ProfileHeader(props) {

  const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
  const token = globalVariables.userInfo.token
  //console.log(222,token);



  useEffect(() => {
   // console.log(333, token);
  }, [token])
  return (
    <>
      {token &&
        <>
          <div>
            <a href="" className="d-block link-light text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={faker.image.avatar()} alt="mdo" width="32" height="32" className="rounded-circle" />
            </a>
            <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
              <li> <Link to={`/${globalVariables.ProjectName}/Profile`} className="dropdown-item">
                Profile </Link> </li>
              <li> <Link to={`/${globalVariables.ProjectName}/MyTickets`} className="dropdown-item">
                MyTickets </Link> </li>
              <li> <Link to={`/${globalVariables.ProjectName}/MyFavorite`} className="dropdown-item">
                MyFavorite </Link> </li>
              <li> <Link to={`/${globalVariables.ProjectName}/MyComments`} className="dropdown-item">
                MyComments </Link> </li>
              <li> <Link to={`/${globalVariables.ProjectName}/MyOrders`} className="dropdown-item">
                MyOrders </Link> </li>

              {/* <li><a className="dropdown-item" href="">MyTickets</a></li>
              <li><a className="dropdown-item" href="">MyFavorite</a></li>
              <li><a className="dropdown-item" href="">MyComments</a></li>
              <li><a className="dropdown-item" href="">MyOrders</a></li> */}
              <li><hr className="dropdown-divider" /></li>
              <li style={{ textAlign: 'center' }}> <Logout /> </li>
            </ul>
          </div>
        </>}
      {!token && <>
        <Link to={`/${globalVariables.ProjectName}/Login`}>
          <button className="btn btn-success login_btn">login</button>
        </Link>

        {/* <button className="btn btn-success login_btn">Register</button> */}
      </>}
    </>
  );
}

export default ProfileHeader;