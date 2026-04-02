import { Navigate, Route, Routes } from "react-router-dom";
import ToastContainer from "./components/ToastContainer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminPage from "./pages/admin/AdminPage";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminReports from "./pages/admin/AdminReports";
import PaymentPage from "./pages/payment/PaymentPage";
import POSPage from "./pages/pos/POSPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<POSPage />} />
        <Route path="/pos" element={<Navigate to="/" replace />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </div>
  );
}
