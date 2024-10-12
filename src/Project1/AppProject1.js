

import Login from './Component/Login/LoginHtml';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmailSender from './Component/EmailSender/EmailSender';
import ForgottPass from './Component/ForgottPass/ForgottPass';
import ChangePass from './Component/ChangePass/ChangePass';
import MasterPage from './Component/Master/MasterPage';
import MasterLayouy from './Component/Master/MasterLayouy';
import Filters from './Component/Filters/Filters';
import ProductCard from './Component/ProductCard/ProductCard'
import ProductCardDetails from './Component/ProductCard/ProductCardDetails/ProductCardDetails'
import DataGrid from './Component/DataGrid/DataGrid'
import Comment from './Component/Comment/Comment'
import SetForChat from './Component/Chat/SetForChat'
import Chat from './Component/Chat/Chat'
import AboutUs from './Component/AboutUs/AboutUs'
import Page404 from './Component/Page404/Page404'
import FAQ from './Component/FAQ/FAQ'
import ShareURL from './Component/ShareURL/ShareURL'
import TicketDetails from './Component/Ticket/TicketDetails';
import NewTicket from './Component/Ticket/NewTicket';
import MyComments from './Component/Comment/MyComments'
import MyFavorite from './Component/Favorite/MyFavorite'
import ShoppingCard from './Component/ShoppingCard/ShoppingCard'
import MyTickets from './Component/Ticket/MyTickets';
import MyOrders from './Component/ShoppingCard/MyOrders';
import OrderDetails from './Component/ShoppingCard/OrderDetails';
import Profile from './Component/Profile/Profile'
import MainGroupTable from './Component/TablesRepository/MainGroupTable/MainGroupTable'
import ProductTable from './Component/TablesRepository/ProductTable/ProductTable'
import Template from './Component/Template/Template'
import Calendar from './Component/Calendar/Calendar'
import { GlobalVariableProvider } from './Context/GlobalVariableContext';
import './Public/Bootstrap/bootstrap.min.css'

function AppProject1() {
   // console.log(3);
    return (
        <GlobalVariableProvider>
            <div className="App">
                <MasterPage>
                    <Routes>
                        <Route path="/*" element={<ProductCard />} />
                        <Route path="/" element={<ProductCard />} />
                        {/* <Route path="/" element={<MasterLayouy />} /> */}
                        <Route path="/appProject1" element={<MasterLayouy />} />
                        <Route path="/Login" element={<Login />} />
                        <Route path="/sendEmail" element={<EmailSender />} />
                        <Route path="/ForgottPass" element={<ForgottPass />} />
                        <Route path="/ChangePass/:token" element={<ChangePass />} />
                        <Route path="/ChangePass" element={<ChangePass />} />
                        <Route path="/Filters" element={<Filters />} />
                        <Route path="/ProductCard" element={<ProductCard />} />
                        <Route path="/ProductCardDetails" element={<ProductCardDetails />} />
                        <Route path="/DataGrid" element={<DataGrid />} />
                        <Route path="/Comment" element={<Comment />} />
                        <Route path="/SetForChat" element={<SetForChat />} />
                        <Route path="/Chat" element={<Chat />} />
                        <Route path="/AboutUs" element={<AboutUs />} />
                        <Route path="/Page404" element={<Page404 />} />
                        <Route path="/FAQ" element={<FAQ />} />
                        <Route path="/ShareURL" element={<ShareURL />} />
                        <Route path="/MyTickets" element={<MyTickets />} />
                        <Route path="/TicketDetails" element={<TicketDetails />} />
                        <Route path="/NewTicket" element={<NewTicket />} />
                        <Route path="/MyComments" element={<MyComments />} />
                        <Route path='/MyFavorite' element={<MyFavorite />} />
                        <Route path='/ShoppingCard' element={<ShoppingCard />} />
                        <Route path="/MyOrders" element={<MyOrders />} />
                        <Route path="/OrderDetails" element={<OrderDetails />} />
                        <Route path="/Profile" element={<Profile />} />
                        <Route path="/MainGroupTable" element={<MainGroupTable />} />
                        <Route path="/ProductTable" element={<ProductTable />} />
                        <Route path="/Template" element={<Template />} />
                        <Route path="/Calendar" element={<Calendar />} />
                    </Routes>
                </MasterPage>
            </div>
        </GlobalVariableProvider>
    );
}

export default AppProject1;
