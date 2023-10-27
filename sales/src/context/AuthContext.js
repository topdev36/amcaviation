import { createContext, useEffect, useReducer } from "react";
import { BackendAPI } from ""
const initialState = {
	user: null,
	isAuthenticated: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "INIT": {
			const { isAuthenticated, user } = action.payload;
			return { ...state, isAuthenticated, user };
		}

		case "LOGIN": {
			const { user } = action.payload;
			return { ...state, isAuthenticated: true, user };
		}

		case "LOGOUT": {
			return { ...state, isAuthenticated: false, user: null };
		}

		case "REGISTER": {
			const { user } = action.payload;

			return { ...state, isAuthenticated: true, user };
		}

		default:
			return state;
	}
};

const AuthContext = createContext({
	...initialState,
	method: "JWT",
	login: () => {},
	logout: () => {},
	register: () => {},
});

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		console.log("init auth...");
		// i18nInit(() => {});
		(async () => {
			try {
				const { data } = await BackendAPI.getuserstate();
				console.log("inituserdata:", data);
				if (data.success)
					dispatch({
						type: "INIT",
						payload: { isAuthenticated: true, user: data },
					});
				else
					dispatch({
						type: "INIT",
						payload: { isAuthenticated: false, user: null },
					});
			} catch (err) {
				console.error(err);
				dispatch({
					type: "INIT",
					payload: { isAuthenticated: false, user: null },
				});
			}
		})();
	}, []);

	const login = async (email, type, data) => {
		const response = await BackendAPI.login({ email, type, data });
		const user = response.data;
		console.log(user);
		if (user.success) dispatch({ type: "LOGIN", payload: { user } });
		return user.success;
	};

	const register = async (data) => {
		const response = await BackendAPI.register(data);
		const user = response.data;
		if (user.success) dispatch({ type: "REGISTER", payload: { user } });
		return user.success;
	};

	const logout = async () => {
		console.log("logout");
		let ret = await BackendAPI.logout();
		if (ret.data.success) {
			dispatch({ type: "LOGOUT" });
		} else console.log("logout failed.");
	};

	return (
		<AuthContext.Provider
			value={{ ...state, method: "JWT", login, logout, register }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
