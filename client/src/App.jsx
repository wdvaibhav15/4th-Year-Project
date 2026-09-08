import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AllRooms from './pages/AllRooms'
import Footer from './components/Footer'
import RoomDetails from './pages/RoomDetails'
import MyBooking from './pages/MyBooking'
import HotelReg from './components/HotelReg'
import Layout from './pages/HotelOwner/Layout'
import Dashboard from './pages/HotelOwner/Dashboard'
import AddRoom from './pages/HotelOwner/AddRoom'
import ListRoom from './pages/HotelOwner/ListRoom'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import Loader from './components/Loader'
import About from './pages/About'
import Experience from './pages/Experience'
import HotelChatbot from './components/HotelChatbot'

const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner")
    const {showHotelReg} = useAppContext();
  return (
    <div>
    <Toaster/>
    { !isOwnerPath && <Navbar />}
    {showHotelReg && <HotelReg/>}
    <div className="min-h-[70vh]">
      <Routes>
        <Route path ='/' element={<Home/>} />
        <Route path ='/rooms' element={<AllRooms/>} />
        <Route path ='/rooms/:id' element={<RoomDetails/>} />
        <Route path ='/experiences' element={<Experience  />} />
        <Route path ='/about' element={<About  />} />
        <Route path ='/my-bookings' element={<MyBooking  />} />
        <Route path ='/loader/:nextUrl' element={<Loader  />} />
        <Route path="/owner" element={<Layout />}>
               <Route index element={<Dashboard />}/>
               <Route path="add-room" element={<AddRoom />}/>
               <Route path="list-room" element={<ListRoom />}/>

        </Route>
      </Routes>
    </div>
    {!isOwnerPath && <HotelChatbot />}
    <Footer/>
   
    </div>
  )
}

export default App
