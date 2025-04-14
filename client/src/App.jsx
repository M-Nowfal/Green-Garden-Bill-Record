import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Toaster } from "sonner";
import { PageNotFound } from "./pages/PageNotFound";
import { createContext, useState } from "react";
import { Home } from "./pages/Home";
import { LogIn } from "./components/auth_components/LogIn";
import { LogOut } from "./components/auth_components/LogOut";
import { UserRegistration } from "./components/auth_components/UserRegistration";
import { ForgotPassword } from "./components/auth_components/ForgotPassword";
import { OTPVerification } from "./components/auth_components/OTPVerification";
import { ViewSingleBuilding } from "./pages/ViewSingleBuilding";
import { NewPassword } from "./components/auth_components/NewPassword";
import { Admin } from "./components/admin_components/Admin";
import { AdminPage } from "./pages/AdminPage";
import { WaterBillForm } from "./pages/WaterBillForm";
import { WaterBillHistory } from "./pages/WaterBillHistory";
import { EditUser } from "./components/admin_components/EditUser";
import { RemoveUser } from "./components/admin_components/RemoveUser";

export const AppContext = createContext();

export const App = () => {

	const router = createBrowserRouter([
		{ path: "/", element: <Home /> },
		{ path: "/login", element: <LogIn /> },
		{ path: "/logout", element: <LogOut /> },
		{ path: "/register", element: <UserRegistration /> },
		{ path: "/verifyotp", element: <OTPVerification /> },
		{ path: "/forgotpwd", element: <ForgotPassword /> },
		{ path: "/newpwd", element: <NewPassword /> },
		{ path: "/view-single-building", element: <ViewSingleBuilding /> },
		{ path: "/admin", element: <Admin /> },
		{ path: "/adminpage", element: <AdminPage /> },
		{ path: "/recordwaterbill", element: <WaterBillForm /> },
		{ path: "/history/:doorNo", element: <WaterBillHistory /> },
		{ path: "/edit-user", element: <EditUser /> },
		{ path: "/remove-user", element: <RemoveUser /> },
		{ path: "*", element: <PageNotFound /> }
	]);

	const [theme, setTheme] = useState(false);
		const [currentActiveIcon, setCurrentActiveIcon] = useState("home");

	const contextValues = {
		theme, setTheme, currentActiveIcon, setCurrentActiveIcon
	}

	return (
		<>
			<AppContext.Provider value={contextValues}>
				<Toaster
					richColors
					position="top-center"
					swipeDirections={["left", "right"]}
					duration={5000}
				/>
				<RouterProvider router={router} />
			</AppContext.Provider>
		</>
	);
}
