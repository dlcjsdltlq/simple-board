import axios from "axios";

export const refreshToken = async (setIsLogined) => {
	const result = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/user/silent-refresh`, {}, {
        withCredentials: true
    });
    if (result.status !== 200) return false;
	const expires = new Date(result.data.data.expires) - new Date();
	const token = result.data.data.token;
    console.log(expires);
	setTimeout(refreshToken, expires);
	axios.defaults.headers.common['Authorization'] = token;
    return true;
};