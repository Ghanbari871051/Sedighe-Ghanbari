import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MySite from './MySite/MySite.jsx';
import AppProject1 from './Project1/AppProject1.js';
import { GlobalVariableProvider } from './Project1/Context/GlobalVariableContext.js';
import Profile from './Project1/Component/Profile/Profile.jsx';
import Calendar from './Project1/Component/Calendar/Calendar.jsx';
import Login from './Project1/Component/Login/LoginHtml.jsx';
import Chat from './Project1/Component/Chat/Chat.jsx'
import Comment from './Project1/Component/Comment/Comment.jsx'
import MainGroupTable from './Project1/Component/TablesRepository/MainGroupTable/MainGroupTable.jsx'
import FAQ from './Project1/Component/FAQ/FAQ.jsx'
import Favorite from './Project1/Component/Favorite/Favorite.jsx';
import Filters from './Project1/Component/Filters/Filters.jsx';
import FiveStar from './Project1/Component/FiveStar/FiveStar.jsx';
import Footer from './Project1/Component/Footer/Footer.jsx';
import Header from './Project1/Component/Header/Header.jsx';
import Map from './Project1/Component/Map/Map.jsx';
import ProductCard from './Project1/Component/ProductCard/ProductCard.jsx';
import RichText from './Project1/Component/RichText/RichText.jsx';
import ShoppingCard from './Project1/Component/ShoppingCard/ShoppingCard.jsx';
import Vehicle from './Vehicle/AppVehicle.js';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MySite />} />
          <Route path="/appProject1/*" element={<AppProject1 />} />
          <Route path="/Vehicle/*" element={<Vehicle />} />
        </Routes>
      </Router >

       <GlobalVariableProvider>
        <Router>
          <Routes>
            <Route path="/Profile" element={<Profile margin={'50px'} />} />
            <Route path="/Calendar" element={<Calendar type={'en'} margin={'50px'} />} />
            <Route path="/Login" element={<Login ShowForPortfolio={true} />} />
            <Route path="/Chat" element={<Chat margin={'50px'} />} />
            <Route path="/Comment" element={<Comment id={1} margin={'50px'} />} />
            <Route path="/MainGroupTable" element={<MainGroupTable />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/Favorite" element={<Favorite />} />
            <Route path="/Filters" element={<Filters ShowForPortfolio={true} margin={'50px'} />} />
            <Route path="/FiveStar" element={<FiveStar />} />
            <Route path="/Footer" element={<Footer />} />
            <Route path="/Header" element={<Header />} />
            <Route path="/Map" element={<Map />} />
            <Route path="/ProductCard" element={<ProductCard />} />
            <Route path="/RichText" element={<RichText />} />
            <Route path="/ShoppingCard" element={<ShoppingCard ShowForPortfolio={true} />} />

          </Routes>
        </Router >
      </GlobalVariableProvider> 

    </>

  );
}

export default App;
