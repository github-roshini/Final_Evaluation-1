
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup';
import SignIn from './Components/SignIn';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Restaurants from './Components/Restaurants';
import McDonalds from './Pages/McDonalds';
import KFC from './Pages/KFC';
import PapaJohns from './Pages/PapaJohns';
import TexasChicken from './Pages/TexasChicken';
import BurgerKing from './Pages/BurgerKing';
import ShaurmaNo1 from './Pages/ShaurmaNo1';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Payment from './Pages/Payment';
import OrderSuccessfull from './Pages/OrderSuccessfull';
import Address from './Pages/Address';
import AddressEdit from './Pages/AddressEdit';
import Profile from './Pages/Profile';


function App() {

    return (
      <BrowserRouter>
        <Routes> 
           <Route path="/" element={<SignIn />} />
           <Route path="/signup" element={<Signup/>} />
           <Route path='/home' element= {<Home/>}/>
           <Route path='/restaurants' element={<Restaurants/>}/>
           <Route path='/McDonalds.com' element={<McDonalds/>}/>
           <Route path='/KFC.com' element={<KFC/>}/>
           <Route path='/PapaJohns.com' element={<PapaJohns/>}/>
           <Route path='/TexasChicken.com' element={<TexasChicken/>}/>
           <Route path='/BurgerKing.com' element={<BurgerKing/>}/>
           <Route path='/ShaurmaNo1.com' element={<ShaurmaNo1/>}/>
           <Route path='/Cart' element={<Cart/>}/>
           <Route path='/Checkout' element={<Checkout/>}/>
           <Route path='/Payment' element={<Payment/>}/>
           <Route path='/Order Successful' element={<OrderSuccessfull/>}/>
           <Route path='/Address' element={<Address/>}/>
           <Route path='/Address Edit' element={<AddressEdit/>}/>
           <Route path='/Profile' element={<Profile/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    );
}

export default App
