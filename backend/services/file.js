import cryptoJS from 'crypto-js';
import fs from 'fs';

export const hashFile = (buffer) => {
	const hash = cryptoJS.SHA256(cryptoJS.lib.WordArray.create(buffer));
	return '' + hash;
};

export const saveFile = (buffer, location) => {
	fs.writeFileSync(location, buffer);
};

export const getFile = (location) => {
	return fs.readFileSync(location);
};
