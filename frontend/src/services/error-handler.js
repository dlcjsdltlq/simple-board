import { error } from '../constants/error';

export const errorHandler = (err) => {
	if (error[err]) {
		window.alert(error[err].korMsg);
	}
};
