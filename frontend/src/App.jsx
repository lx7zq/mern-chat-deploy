import { Route, Routes, Navigate } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Signin";
import Setting from "./pages/Setting"
import Profile from "./pages/Profile";
import Navbar from "./component/Navbar";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";


function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useThemeStore();
  //const theme = "dark";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // แสดง Loader ขณะที่กำลังตรวจสอบสถานะการเข้าสู่ระบบ
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // หากตรวจสอบเสร็จแล้ว จะแสดงหน้าตามสถานะของผู้ใช้
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        {/* หน้า Home สามารถเข้าถึงได้เมื่อผู้ใช้เข้าสู่ระบบแล้ว */}
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        {/* หน้า Signup สามารถเข้าถึงได้เมื่อผู้ใช้ยังไม่ได้เข้าสู่ระบบ */}
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        {/* หน้า Login สามารถเข้าถึงได้เมื่อผู้ใช้ยังไม่ได้เข้าสู่ระบบ */}
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        {/* หน้า Setting สามารถเข้าถึงได้เมื่อผู้ใช้เข้าสู่ระบบ */}
        <Route
          path="/Setting"
          element={ <Setting /> }
        />
        {/* หน้า Profile สามารถเข้าถึงได้เมื่อผู้ใช้เข้าสู่ระบบ */}
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
