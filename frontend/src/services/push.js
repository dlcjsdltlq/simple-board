import axios from 'axios';

const publicVapidKey = process.env.REACT_APP_VAPID_KEY;

const urlBase64ToUint8Array = (base64String) => {
	var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

	var rawData = window.atob(base64);
	var outputArray = new Uint8Array(rawData.length);

	for (var i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};

export const runPushWorker = async () => {
	if (!('serviceWorker' in navigator)) return;
	const registration = await navigator.serviceWorker.register('push-worker.js', { scope: '/' });

	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
	});

	console.log(subscription);

	await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/user/subscribe-push`, subscription);

	localStorage.setItem('isSubscriptionSent', 1);
};
