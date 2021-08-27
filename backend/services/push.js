import webpush from 'web-push';

export const setWebPush = (publicVapidKey, privateVapidKey) => {
    webpush.setVapidDetails(`mailto:${process.env.EMAIL_USER}`, publicVapidKey, privateVapidKey);
};

export const sendNotification = (subscription, payload) => {
    console.log(subscription)
	return webpush.sendNotification(subscription, JSON.stringify(payload));
};
