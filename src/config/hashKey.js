var CryptoJS = require('crypto-js');

const encode = data => {
	var wordArray = CryptoJS.enc.Utf8.parse(data);
	var base64 = CryptoJS.enc.Base64.stringify(wordArray);
	return base64;
};

const decode = data => {
	var parsedWordArray = CryptoJS.enc.Base64.parse(data);
	var parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
	return parsedStr;
};

export { encode, decode };
