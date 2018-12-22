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
const vstruct = require('varstruct');

const PlainTextContent = vstruct([
	{ name: 'type', type: vstruct.UInt8 },
	{ name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
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
			if (response.data.result.height === '0') return false;
			else {
				return true;
			}
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

const checkIfEnoughBandwidth = (
	tx,
	bandwidth,
	bandwidthTime,
	bandwidthLimit,
	currentTxTime,
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
		new Date(),
	);
	if (isEnoughBandwidth) {
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		const result = await commitTxToBroadcast(txEncode);
		return result;
	} else {
		return false;
	}
};

const postContent = async (account, privateKey) => {
	var url = api.API_GET_ACCOUNT_TRANSACTIONS + account + '%27%22';
	const accountTransactions = await axios({
		url,
		method: 'GET',
	});
	if (accountTransactions.status === 200) {
		const allTransaction = accountTransactions.data.result.txs.map(item => {
			const data = Buffer.from(item.tx, 'base64');
			const transaction = v1.decode(data);
			return transaction;
		});
		const accountTrans = allTransaction.filter(item => {
			return item.account === account;
		});
		const sequence = accountTrans.length + 1;
		const content = 'Nguyen Ho Quoc Thinh vừa post bài';
		let post_content = PlainTextContent.encode({
			type: 1,
			text: content,
		});
		const tx = {
			version: 1,
			operation: 'post',
			account: account,
			params: {
				content: post_content,
				keys: [],
			},
			sequence: sequence,
			memo: Buffer.alloc(0),
		};
		transaction.sign(tx, privateKey);
		console.log(tx);
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		url = `${api.API_COMMIT_TRANSACTION}${txEncode}`;
		const res = await axios({
			url,
			method: 'POST',
		});
		console.log(res);
	}
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
	const data = {
		bandwidth: bandwidthLimit - accountBandwidth,
		bandwidthTime: preTxTime,
		bandwidthLimit: bandwidthLimit,
	};
	return data;
};

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
		new Date(),
	);
	if (isEnoughBandwidth) {
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		const result = await commitTxToBroadcast(txEncode);
		return result;
	} else {
		return false;
	}
};

export {
	calculateBandwidth,
	calculateAccountBalance,
	transferMoney,
	getAccountUsername,
	updateAccountProfile,
};
