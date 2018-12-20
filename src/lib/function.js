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

const readAllTransactionsOfOneACcount = async account => {
	var url = api.API_GET_ACCOUNT_TRANSACTIONS + account + '%27%22';
	const accountTransactions = await axios({
		url,
		method: 'GET',
	});
	if (accountTransactions.status === 200) {
		const total_count = accountTransactions.data.result.total_count;
		console.log(`Total transaction: ${total_count}`);
		if (total_count !== '0') {
			accountTransactions.data.result.txs.map(item => {
				console.log(item);
				const data = Buffer.from(item.tx, 'base64');
				const transaction = v1.decode(data);
				console.log(transaction);
				if (transaction.operation === 'post') {
					try {
						const y = Buffer.from(transaction.params.content, 'base64');
						const x = PlainTextContent.decode(y);
					} catch (e) {
						console.log();
					}
				}
			});
		} else {
			console.log('Accout doesn\'t exist');
		}
	}
};

const calculateAccountBalance = async account => {
	var url = api.API_GET_ACCOUNT_TRANSACTIONS + account + '%27%22';
	return axios.get(url).then(response => {
		const transactions = response.data.result.txs.map(item => {
			const data = Buffer.from(item.tx, 'base64');
			const transaction = v1.decode(data);
			return transaction;
		});
		const result = transactions.filter(item => {
			return item.operation === 'payment';
		});
		var balance = 0;
		for (var i = 0; i < result.length; i++) {
			if (result[i].account != account) {
				balance = balance + result[i].params.amount;
			} else {
				balance = balance - result[i].params.amount;
			}
		}
		return balance;
	});
};

const transferMoney = async (account, accountPrivateKey, address) => {
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
		const tx = {
			version: 1,
			operation: 'payment',
			account: account,
			params: {
				address: address,
				amount: 100,
			},
			sequence: sequence,
			memo: Buffer.alloc(0),
		};
		transaction.sign(tx, accountPrivateKey);
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		url = `${api.API_COMMIT_TRANSACTION}${txEncode}`;
		const res = await axios({
			url,
			method: 'POST',
		});
		console.log(res);
	}
};

const PlainTextContent = vstruct([
	{ name: 'type', type: vstruct.UInt8 },
	{ name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);

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

const calculateBandwidth = async account => {
	var url = api.API_GET_ACCOUNT_TRANSACTIONS + account + '%27%22';
	const accountBalance = await calculateAccountBalance(account);
	const transactions = await axios({
		url,
		method: 'GET',
	});
	var myBandwidth = 0;
	var x1 = null;
	const bandwidthLimit = Math.floor(
		(accountBalance / MAX_CELLULOSE) * NETWORK_BANDWIDTH
	);
	for (var i = 0; i < transactions.data.result.total_count; i++) {
		var bandwidthTime = x1;
		const base64Data = Buffer.from(
			transactions.data.result.txs[i].tx,
			'base64'
		);
		const data = v1.decode(base64Data);
		console.log(data);
		if(data.account === account){
			const txTime = await getTxTime(transactions.data.result.txs[i].height);
			var txBandwidth = bandwidth(
				transactions.data.result.txs[i].tx,
				txTime,
				bandwidthTime,
				myBandwidth
			);
			x1 = txTime;
			myBandwidth = txBandwidth.bandwith;
		}
	}
	return bandwidthLimit - myBandwidth;
};

export { calculateBandwidth };
