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

// Ham dung chung
// Lay sequence cho tx moi
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
// Lay tat ca transaction cua account
const getAllTransactions = async account => {
	const per_page = 50;
	var currentPage = 1;
	const url = `${api.API_GET_ACCOUNT_TRANSACTIONS}${account}%27%22`;
	const response = await axios({
		url,
		method: 'GET',
	});
	const total_count = response.data.result.total_count;
	const total_page = Math.ceil(total_count / per_page);
	var allTransaction = [];
	for (let i = 0; i < total_page; i++) {
		var data = await getTransaction(account, per_page, i + 1);
		var tmp = allTransaction;
		allTransaction = tmp.concat(data);
	}
	return allTransaction;
};
// Lay cac transaction cua account co trong page
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
// Dua tx len block
const commitTxToBroadcast = txEncode => {
	const url = `${api.API_COMMIT_TRANSACTION}${txEncode}`;
	return axios
		.post(url)
		.then(response => {
			if (response.data.result.height === '0') return false;
			else {
				return true;
			}
		})
		.catch(error => {
			return false;
		});
};
// Lay thoi gian tx duoc tao
const getTxTime = height => {
	const url = `${api.API_BLOCK_HEIGHT}${height}`;
	return axios.get(url).then(response => {
		return new Date(response.data.result.block.header.time);
	});
};
// Tinh bandwidth cua mot transaction
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

// Ham chinh
// Tao account moi
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

// Lay account username
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
	const sequence = getSequence(allTransaction, account);
	allTransaction.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const decodeData = v1.decode(data);
		if (decodeData.operation === 'post') {
			try {
				const y = Buffer.from(decodeData.params.content, 'base64');
				const x = PlainTextContent.decode(y);
			} catch (e) {
				console.log();
			}
		}
		if (decodeData.operation === 'update_account') {
			if (decodeData.params.key === 'name') {
				try {
					console.log(decodeData.params.value.toString());
				} catch (e) {
					console.log();
				}
			}
		}
	});
};

// Tinh so balance cua account
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

// Kiem tra bandwidth cua account co du de thuc hien commit
const checkIfEnoughBandwidth = (
	tx,
	bandwidth,
	bandwidthTime,
	bandwidthLimit,
	currentTxTime
) => {
	const base64Data = Buffer.from(tx, 'base64');
	const txSize = base64Data.length;
	const currentTime = currentTxTime;
	let diff = BANDWIDTH_PERIOD;
	if (
		moment(currentTime).unix() - moment(bandwidthTime).unix() <
		BANDWIDTH_PERIOD
	) {
		diff = moment(currentTime).unix() - moment(bandwidthTime).unix();
	}
	const bandwidthConsume = Math.ceil(
		Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * bandwidth +
			txSize
	);
	if (bandwidthLimit < bandwidthConsume) return false;
	if (bandwidthLimit - bandwidthConsume <= 0) return false;
	return true;
};

// Chuyen khoan cho account khac
const transferMoney = async (
	account,
	privateKey,
	address,
	amount,
	bandwidth,
	bandwidthTime,
	bandwidthLimit
) => {
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
	const isEnoughBandwidth = checkIfEnoughBandwidth(
		transaction.encode(tx),
		bandwidth,
		bandwidthTime,
		bandwidthLimit,
		new Date()
	);
	if (isEnoughBandwidth) {
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		const result = await commitTxToBroadcast(txEncode);
		return result;
	} else {
		return false;
	}
};

// Dang bai viet
const postContent = async (
	account,
	privateKey,
	data,
	bandwidth,
	bandwidthTime,
	bandwidthLimit
) => {
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
	const isEnoughBandwidth = checkIfEnoughBandwidth(
		transaction.encode(tx),
		bandwidth,
		bandwidthTime,
		bandwidthLimit,
		new Date()
	);
	if (isEnoughBandwidth) {
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		const result = await commitTxToBroadcast(txEncode);
		return result;
	} else {
		return false;
	}
};

// Lay tat ca bai post cua account
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

// Tinh bandwidth hien tai cua account
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
	const data = {
		bandwidth: bandwidthLimit - accountBandwidth,
		bandwidthTime: preTxTime,
		bandwidthLimit: bandwidthLimit,
	};
	return data;
};

// Cap nhat username cua account
const updateAccountProfile = async (
	account,
	privateKey,
	data,
	bandwidth,
	bandwidthTime,
	bandwidthLimit
) => {
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
	const isEnoughBandwidth = checkIfEnoughBandwidth(
		transaction.encode(tx),
		bandwidth,
		bandwidthTime,
		bandwidthLimit,
		new Date()
	);
	if (isEnoughBandwidth) {
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		const result = await commitTxToBroadcast(txEncode);
		return result;
	} else {
		return false;
	}
};

// Lay avatar cua account
const getAccountAvatar = async account => {
	const allTransaction = await getAllTransactions(account);
	var avatar = '';
	allTransaction.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const decodeData = v1.decode(data);
		if (decodeData.operation === 'update_account') {
			if (decodeData.params.key === 'picture') {
				try {
					if (decodeData.params.value.toString('base64') !== '')
						avatar = decodeData.params.value.toString('base64');
				} catch (e) {
					console.log();
				}
			}
		}
	});
	return avatar;
};
// Cap nhat avatar cua account
const updateAccountAvatar = async (
	account,
	privateKey,
	data,
	bandwidth,
	bandwidthTime,
	bandwidthLimit
) => {
	const realData = data.slice(23);
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
	const isEnoughBandwidth = checkIfEnoughBandwidth(
		transaction.encode(tx),
		bandwidth,
		bandwidthTime,
		bandwidthLimit,
		new Date()
	);
	if (isEnoughBandwidth) {
		const txEncode = transaction.encode(tx).toString('base64');
		return axios
			.post('https://komodo.forest.network/', {
				jsonrpc: '2.0',
				id: 1,
				method: 'broadcast_tx_commit',
				params: [`${txEncode}`],
			})
			.then(res => {
				console.log(res.data);
				return true;
			})
			.catch(e => {
				return false;
			});
	} else {
		return false;
	}
};

// Lay danh sach following
const getFollowing = async account => {
	const allTransaction = await getAllTransactions(account);
	var result = [];
	allTransaction.map(item => {
		const data = Buffer.from(item.tx, 'base64');
		const decodeData = v1.decode(data);
		if (decodeData.operation === 'update_account') {
			if (decodeData.params.key === 'followings') {
				try {
					const data = v1.Followings.decode(decodeData.params.value);
					data.addresses.forEach(item => {
						result.push(base32.encode(item));
					});
				} catch (e) {
					console.log();
				}
			}
		}
	});
	return result;
};

// Kiem tra xem tai khoan co ton tai hay khong
const checkIfAccountIsExits = async account => {
	const url = `${api.API_GET_ACCOUNT_TRANSACTIONS}${account}%27%22`;
	const response = await axios({
		url,
		method: 'GET',
	});
	return response.data.result.total_count !== '0' ? true : false;
};

// Thuc hien following mot tai khoan
const followAnotherAccount = async (
	account,
	privateKey,
	data,
	bandwidth,
	bandwidthTime,
	bandwidthLimit
) => {
	const allTransaction = await getAllTransactions(account);
	const sequence = getSequence(allTransaction, account);
	const tmp = data.map(item => {
		return Buffer.from(base32.decode(item));
	});
	const addresses = v1.Followings.encode({
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
	const isEnoughBandwidth = checkIfEnoughBandwidth(
		transaction.encode(tx),
		bandwidth,
		bandwidthTime,
		bandwidthLimit,
		new Date()
	);
	if (isEnoughBandwidth) {
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		const result = await commitTxToBroadcast(txEncode);
		return result;
	} else {
		return false;
	}
};

// Lay tong so page cua 1 account
const getAccountPageAvailable = async (account, per_page) => {
	const url = `${api.API_GET_ACCOUNT_TRANSACTIONS}${account}%27%22`;
	const response = await axios({
		url,
		method: 'GET',
	});
	const total_count = response.data.result.total_count;
	return Math.ceil(total_count / per_page);
};

// Lay nhung bai post cua account co trong page
const getAccountPostsInPage = async (account, per_page, page) => {
	const total_page = await getAccountPageAvailable(account, per_page);
	var result = [];
	var newPage;
	if (page <= total_page) {
		for (var currentPage = page; currentPage <= total_page; currentPage++) {
			var transactions = await getTransaction(account, per_page, currentPage);
			transactions.forEach(item => {
				const data = Buffer.from(item.tx, 'base64');
				const decodeData = v1.decode(data);
				if (decodeData.operation === 'post') {
					try {
						const content_base64 = Buffer.from(
							decodeData.params.content,
							'base64'
						);
						const real_data = v1.PlainTextContent.decode(content_base64);
						result.push(real_data);
					} catch (e) {
						console.log();
					}
				}
			});
			newPage = currentPage+1;
			if (result.length !== 0) {
				break;
			}
		}
	} else {
		newPage = page;
	}
	const data = {
		newPosts: result,
		newPage: newPage,
	};
	return data;
};

export {
	postContent,
	getFollowing,
	transferMoney,
	getAccountPosts,
	getAccountAvatar,
	calculateBandwidth,
	getAccountUsername,
	updateAccountAvatar,
	updateAccountProfile,
	followAnotherAccount,
	checkIfAccountIsExits,
	getAccountPostsInPage,
	calculateAccountBalance,
};
