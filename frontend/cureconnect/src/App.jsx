import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import PrescriptionList from './pages/PrescriptionList';
import PrescribedMedicine from './pages/PrescribedMedicine'
import OrderDetails from './pages/OrderDetails';
import ContactUs from './pages/ContactUs/ContactUs';
import Error404 from './pages/Error404';
import Faq from './pages/FAQ/Faq';


function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/prescriptionlist' element={<PrescriptionList/>} />
          <Route path='/prescribedmedicine' element={<PrescribedMedicine/>} />
          <Route path='/orderdetails' element={<OrderDetails/>} />
          <Route path='/contactus' element={<ContactUs/>} />
          <Route path='*' element={<Error404/>} />
          <Route path='/faq' element={<Faq/>} />
        </Routes>
      </Router>
      <div className="bg-backgroundColor w-full"></div>
    </div>
  )
}

export default App