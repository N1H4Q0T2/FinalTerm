import axios from 'axios';
import moment from 'moment';
import * as v1 from './tx/v1';
import * as transaction from './tx';
import * as key from '../config/key';
import * as api from '../config/api';
import { Keypair } from 'stellar-base';
import {
	BANDWIDTH_PERIOD,
	MAX_CELLULOSE,
	NETWORK_BANDWIDTH,
} from '../config/metric';
import base32 from 'base32.js';
const vstruct = require('varstruct');

const PlainTextContent = vstruct([
	{ name: 'type', type: vstruct.UInt8 },
	{ name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);

const Followings = vstruct([
	{
		name: 'addresses',
		type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)),
	},
]);

const getSequence = (transactions, account) => {
	const allTransaction = transactions.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const transaction = v1.decode(data);
		return transaction;
	});
	const accountTrans = allTransaction.filter(item => {
		return item.account === account;
	});
	return accountTrans.length + 1;
};

const getAllTransactions = async account => {
	const per_page = 50;
	var currentPage = 1;
	const url = `${api.API_GET_ACCOUNT_TRANSACTIONS}${account}%27%22`;
	const response = await axios({
		url,
		method: 'GET',
	});
	const total_count = response.data.result.total_count;
	const total_page = Math.floor(total_count / per_page) + 1;
	var allTransaction = [];
	for (let i = 0; i < total_page; i++) {
		var data = await getTransaction(account, per_page, i + 1);
		var tmp = allTransaction;
		allTransaction = tmp.concat(data);
	}
	return allTransaction;
};

const getTransaction = async (account, per_page, page) => {
	var url = `${
		api.API_GET_ACCOUNT_TRANSACTIONS
	}${account}%27%22&page=${page}&per_page=${per_page}`;
	const response = await axios({
		url,
		method: 'GET',
	});
	return response.data.result.txs;
};

const commitTxToBroadcast = txEncode => {
	const url = `${api.API_COMMIT_TRANSACTION}${txEncode}`;
	return axios
		.post(url)
		.then(response => {
			console.log(response.data);
			return true;
		})
		.catch(error => {
			return false;
		});
};

const getTxTime = height => {
	const url = `${api.API_BLOCK_HEIGHT}${height}`;
	return axios.get(url).then(response => {
		return new Date(response.data.result.block.header.time);
	});
};

const bandwidth = (tx, time, bandwidthTime, bandwidth) => {
	const base64Data = Buffer.from(tx, 'base64');
	const txSize = base64Data.length;
	const currentTime = time;
	let diff = BANDWIDTH_PERIOD;
	if (bandwidthTime !== null) {
		if (
			moment(currentTime).unix() - moment(bandwidthTime).unix() <
			BANDWIDTH_PERIOD
		) {
			diff = moment(currentTime).unix() - moment(bandwidthTime).unix();
		}
	}
	const bandwidthConsume = Math.ceil(
		Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * bandwidth +
			txSize
	);
	const data = {
		bandwithTime: time,
		bandwith: bandwidthConsume,
	};
	return data;
};

const createAcccount = async () => {
	const account = key.publicKey1;
	const key = Keypair.random();
	const address = key.publicKey();
	const addressPrivateKey = key.secret();
	var url =
		'https://komodo.forest.network/tx_search?query=%22account=%27' +
		account +
		'%27%22';
	const accountTransactions = await axios({
		url,
		method: 'GET',
	});
	if (accountTransactions.status === 200) {
		const length = accountTransactions.data.result.txs.length;
		const tx = {
			version: 1,
			operation: 'create_account',
			account: account,
			params: {
				address: address,
			},
			sequence: length - 1,
			memo: Buffer.alloc(0),
		};
		transaction.sign(tx, key.privateKey1);
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		console.log(txEncode);
		url = 'https://komodo.forest.network/broadcast_tx_commit?tx=';
		url = `${url}${txEncode}`;
		console.log(url);
		const res = await axios({
			url,
			method: 'POST',
		});
		console.log(res);
	}
};

const getAccountUsername = async account => {
	const allTransaction = await getAllTransactions(account);
	var username = '';
	allTransaction.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const decodeData = v1.decode(data);
		if (decodeData.operation === 'update_account') {
			if (decodeData.params.key === 'name') {
				try {
					username = decodeData.params.value.toString();
				} catch (e) {
					console.log();
				}
			}
		}
	});
	return username;
};

const readAllTransactionsOfOneACcount = async account => {
	const allTransaction = await getAllTransactions(account);
	allTransaction.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const decodeData = v1.decode(data);
		if (decodeData.operation === 'post') {
			try {
				console.log(item);
				const y = Buffer.from(decodeData.params.content, 'base64');
				const x = PlainTextContent.decode(y);
				console.log(x);
			} catch (e) {
				console.log();
			}
		}
		if (decodeData.operation === 'interact') {
			try {
				console.log(item);
				console.log(decodeData);
				console.log();
				const y = Buffer.from(decodeData.params.content, 'base64');
				const x = PlainTextContent.decode(y);
				console.log(x);
			} catch (e) {
				console.log();
			}
		}
		if (decodeData.operation === 'update_account') {
			if (decodeData.params.key === 'name') {
				try {
					// console.log(decodeData.params.value.toString());
				} catch (e) {
					console.log();
				}
			}
			if (decodeData.params.key === 'picture') {
				try {
					const data = decodeData.params.value.toString('base64');
					//console.log(data.slice(0));
				} catch (e) {
					console.log();
				}
			}
			if (decodeData.params.key === 'followings') {
				const data = v1.Followings.decode(decodeData.params.value);
				data.addresses.forEach(item => {
					console.log(base32.encode(item));
				});
				console.log('==========');
			}
		}
	});
};

const calculateAccountBalance = async (account, inputData) => {
	const allTransaction = inputData
		? inputData
		: await getAllTransactions(account);
	var balance = 0;
	allTransaction.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const decodeData = v1.decode(data);
		if (decodeData.operation === 'payment') {
			if (decodeData.account === account) {
				balance = balance - decodeData.params.amount;
			} else {
				balance = balance + decodeData.params.amount;
			}
		}
	});
	return balance;
};

const transferMoney = async (account, privateKey, address, amount) => {
	const allTransaction = await getAllTransactions(account);
	const sequence = getSequence(allTransaction, account);
	const tx = {
		version: 1,
		operation: 'payment',
		account: account,
		params: {
			address: address,
			amount: amount,
		},
		sequence: sequence,
		memo: Buffer.alloc(0),
	};
	transaction.sign(tx, privateKey);
	const txEncode = '0x' + transaction.encode(tx).toString('hex');
	const result = await commitTxToBroadcast(txEncode);
	return result;
};

const postContent = async (account, privateKey, data) => {
	const allTransaction = await getAllTransactions(account);
	const sequence = await getSequence(allTransaction, account);
	const content = PlainTextContent.encode({
		type: 1,
		text: data,
	});
	const tx = {
		version: 1,
		operation: 'post',
		account: account,
		params: {
			content: content,
			keys: [],
		},
		sequence: sequence,
		memo: Buffer.alloc(0),
	};
	transaction.sign(tx, privateKey);
	const txEncode = '0x' + transaction.encode(tx).toString('hex');
	const result = await commitTxToBroadcast(txEncode);
	return result;
};

const calculateBandwidth = async account => {
	const allTransaction = await getAllTransactions(account);
	const accountBalance = await calculateAccountBalance(account, allTransaction);
	const totalTx = allTransaction.length;
	const bandwidthLimit = Math.floor(
		(accountBalance / MAX_CELLULOSE) * NETWORK_BANDWIDTH
	);
	var accountBandwidth = 0;
	var preTxTime = null;
	for (var i = 0; i < totalTx; i++) {
		var _preTxTime = preTxTime;
		const txTime = await getTxTime(allTransaction[i].height);
		var txBandwidth = bandwidth(
			allTransaction[i].tx,
			txTime,
			_preTxTime,
			accountBandwidth
		);
		preTxTime = txTime;
		accountBandwidth = txBandwidth.bandwith;
	}
	return bandwidthLimit - accountBandwidth;
};

const updateAccountProfile = async (account, privateKey, data) => {
	const allTransaction = await getAllTransactions(account);
	const sequence = getSequence(allTransaction, account);
	const tx = {
		version: 1,
		operation: 'update_account',
		account: account,
		params: {
			key: 'name',
			value: Buffer.alloc(0),
		},
		sequence: sequence,
		memo: Buffer.alloc(0),
	};
	let updateData = Buffer.from(data, 'utf8');
	tx.params.value = updateData;
	transaction.sign(tx, privateKey);
	const txEncode = '0x' + transaction.encode(tx).toString('hex');
	const result = await commitTxToBroadcast(txEncode);
	console.log(result);
};

const getAccountPosts = async account => {
	const allTransaction = await getAllTransactions(account);
	var result = [];
	allTransaction.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const decodeData = v1.decode(data);
		if (decodeData.operation === 'post') {
			try {
				const content_base64 = Buffer.from(decodeData.params.content, 'base64');
				const real_data = v1.PlainTextContent.decode(content_base64);
				result.push(real_data);
			} catch (e) {
				console.log();
			}
		}
	});
	return result;
};

const updateAccountAvatar = async (account, privateKey, data) => {
	const realData = data.slice(23);
	console.log(Buffer.from(realData, 'base64'));
	const x = new Buffer(Buffer.from(realData, 'base64'));
	const allTransaction = await getAllTransactions(account);
	const sequence = getSequence(allTransaction, account);
	const tx = {
		version: 1,
		operation: 'update_account',
		account: account,
		params: {
			key: 'picture',
			value: x,
		},
		sequence: sequence,
		memo: Buffer.alloc(0),
	};
	transaction.sign(tx, privateKey);
	const txEncode = transaction.encode(tx).toString('base64');
	console.log(txEncode);
	const url = `${api.API_COMMIT_TRANSACTION}${txEncode}`;
	return axios
		.post('https://komodo.forest.network/', {
			jsonrpc: '2.0',
			id: 1,
			method: 'broadcast_tx_commit',
			params: [`${txEncode}`],
		})
		.then(res => {
			return res.data;
		});
};

const getAccountAvatar = async account => {
	const allTransaction = await getAllTransactions(account);
	var avatar = '';
	allTransaction.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const decodeData = v1.decode(data);
		if (decodeData.operation === 'update_account') {
			if (decodeData.params.key === 'picture') {
				try {
					avatar = decodeData.params.value.toString('base64');
				} catch (e) {
					console.log();
				}
			}
		}
	});
	return avatar;
};

const followAnotherAccount = async (account, privateKey, data) => {
	const allTransaction = await getAllTransactions(account);
	const sequence = getSequence(allTransaction, account);
	const tmp = data.map(item => {
		return Buffer.from(base32.decode(item));
	});
	const addresses = Followings.encode({
		addresses: tmp,
	});
	const tx = {
		version: 1,
		sequence: sequence,
		memo: Buffer.alloc(0),
		account: account,
		operation: 'update_account',
		params: {
			key: 'followings',
			value: addresses,
		},
	};
	transaction.sign(tx, privateKey);
	const txEncode = '0x' + transaction.encode(tx).toString('hex');
	const result = await commitTxToBroadcast(txEncode);
	return result;
};

const commentOnePost = async (account, privateKey, data, hashCodeOfPost) => {
	const allTransaction = await getAllTransactions(account);
	const sequence = getSequence(allTransaction, account);
	const content = PlainTextContent.encode({
		type: 1,
		text: data,
	});
	const tx = {
		version: 1,
		operation: 'interact',
		account: account,
		params: {
			object: hashCodeOfPost,
			content: content,
		},
		sequence: sequence,
		memo: Buffer.alloc(0),
	};
	transaction.sign(tx, privateKey);
	const txEncode = '0x' + transaction.encode(tx).toString('hex');
	const result = await commitTxToBroadcast(txEncode);
	return result;
};

const getAllCommentOfOnePost = async (account, hash) => {
	const url = `${api.API_GET_ALL_COMMENT}${hash}%27%22`;
	const allComment = await axios({
		url,
		method: 'GET',
	});
	var result = [];
	allComment.forEach(item => {
		try {
			const base64Data = Buffer.from(item.tx, 'base64');
			const decodeData = v1.decode(base64Data);
			const commentBase64 = Buffer.from(decodeData.params.content, 'base64');
			const comment = PlainTextContent.decode(commentBase64);
			result.push(comment);
		} catch (e) {
			console.log();
		}
	});
	return result;
};

const getAllCommentOfOnePostTest = async hash => {
	const url = `${api.API_GET_ALL_COMMENT}${hash}%27%22`;
	const response = await axios({
		url,
		method: 'GET',
	});
	console.log(response.data.result.txs.length);
	response.data.result.txs.forEach(item => {
		try {
			const base64Data = Buffer.from(item.tx, 'base64');
			const decodeData = v1.decode(base64Data);
			const reactBase64 = Buffer.from(decodeData.params.content, 'base64');
			const react = v1.ReactContent.decode(reactBase64);
			console.log(react);
		} catch (e) {
			console.log();
		}
	});
};

const reactOnePost = async (account, privateKey, hashCodeOfPost, typeOfReaction) => {
	const allTransaction = await getAllTransactions(account);
	const sequence = getSequence(allTransaction, account);
	const content = v1.ReactContent.encode({
		type: 2,
		reaction: typeOfReaction,
	});
	const tx = {
		version: 1,
		operation: 'interact',
		account: account,
		params: {
			object: hashCodeOfPost,
			content: content,
		},
		sequence: sequence,
		memo: Buffer.alloc(0),
	};
	transaction.sign(tx, privateKey);
	const txEncode = '0x' + transaction.encode(tx).toString('hex');
	const result = await commitTxToBroadcast(txEncode);
	return result;
};

const test = async () => {
	// const result = await reactOnePost(
	// 	key.publicKey1,
	// 	key.privateKey1,
	// 	'1B170AE893B1FA37AAF347780F59FE274B1CE2DE4DFE8B5D4115FD69ABE4B937'
	// );

	// console.log(result);
	// // const result = await getAllCommentOfOnePostTest(
	// // 	null,
	// // 	'1B170AE893B1FA37AAF347780F59FE274B1CE2DE4DFE8B5D4115FD69ABE4B937'
	// // );
	// // console.log(result);
	// const result = await getAllCommentOfOnePostTest(
	// 	'1B170AE893B1FA37AAF347780F59FE274B1CE2DE4DFE8B5D4115FD69ABE4B937'
	// );
};

export { test };
