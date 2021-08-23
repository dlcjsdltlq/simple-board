import { makeAutoObservable } from 'mobx';

export default class BoardStore {
	userId = '';
	userName = '';
	isLogined = false;
    constructor() {
        makeAutoObservable(this);
    }
	setUserId = (userId) => {
		this.userId = userId;
	};
	setUserName = (userName) => {
		this.userName = userName;
	};
	setIsLogined = (isLogined) => {
		this.isLogined = isLogined;
	};
}
