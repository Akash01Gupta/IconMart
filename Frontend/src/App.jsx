import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/global.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './addmindashbord/layouts/AdminLayout';

// Pages (Main)
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart.jsx';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetails';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Checkout from './components/orders/Checkout';
import OrderSuccess from './components/orders/OrderSuccess';
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetails';
import OrdersPage from './pages/OrdersPage';
import EditProfile from './pages/EditProfile.jsx';
import TrackOrderPage from './components/orders/TrackOrderPage.jsx'
// import Settings from './pages/Settings.jsx'

// Admin Pages
import Dashboard from './addmindashbord/pages/Dashboard.jsx';
import UsersList from './addmindashbord/pages/UsersList.jsx';
import ProductLists from './addmindashbord/pages/ProductsLists.jsx';
import OrderLists from './addmindashbord/pages/OrdersLists.jsx';
import AdminOrderDetail from './addmindashbord/pages/AdminOrderDetail.jsx';
import OrderDetailView from './addmindashbord/pages/OrderDetailView.jsx';
import AdminAdSettings from './addmindashbord/pages/AdminAdSettings.jsx'


// Auth Routes
import PrivateRoute from './components/common/PrivateRoute';
import AdminPrivateRoute from './addmindashbord/AdminPrivateRoute';
import InvoicesList from './pages/InvoicesList.jsx';

// New Auth Pages
// import UserSignup from './pages/UserSignup.jsx';
import Register from './pages/Register.jsx'
import SellerSignup from './pages/SellerSignup.jsx';
// import ChangePassword from './pages/ChangePassword.jsx';
// import ResetPassword from './pages/ResetPassword.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
         {/* <Route path="/ChangePassword" element={<ChangePassword />} /> */}
          <Route path="/forgotpass" element={<ForgotPassword />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/seller/signup" element={<SellerSignup />} />

        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="products/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
          <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="order" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="order-success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
          <Route path="orderlist" element={<PrivateRoute><OrderList /></PrivateRoute>} />
          <Route path="orderdetail" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="/orderspage" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path='/editProfile' element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/invoices" element={<PrivateRoute><InvoicesList /></PrivateRoute>} />
           <Route path="/track-order" element={<PrivateRoute>< TrackOrderPage/></PrivateRoute>} />
           {/* <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} /> */}

        </Route>

        {/* Admin Layout Routes */}
        <Route path="/admin" element={<AdminPrivateRoute><AdminLayout /></AdminPrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="products" element={<ProductLists />} />
          <Route path="orders" element={<OrderLists />} />
          <Route path="adminorderdetail/:id" element={<AdminOrderDetail />} />
          <Route path="adminorderdetail/:id/:subpage" element={<AdminOrderDetail />} />
          <Route path="adminorderdetail/:id/:detail" element={<OrderDetailView />} />
          <Route path="advertis" element={<AdminAdSettings/>}/>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
