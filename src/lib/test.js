import * as v1 from './tx/v1';
import * as transaction from './tx';
import * as key from '../config/key';
import * as api from '../config/api';
import { Keypair } from 'stellar-base';
import axios from 'axios';

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
				const data = Buffer.from(item.tx, 'base64');
				const transaction = v1.decode(data);
				console.log(transaction);
				if (transaction.operation === 'post') {
					console.log(transaction.params.content);
					const y = Buffer.from(transaction.params.content, 'base64');
					console.log(y);
					const x = v1.decode(y);
				}
			});
		} else {
			console.log('Accout doesn\'t exist');
		}
	}
};

const calculateAccountBalance = async account => {
	var url = api.API_GET_ACCOUNT_TRANSACTIONS + account + '%27%22';
	const accountTransactions = await axios({
		url,
		method: 'GET',
	});
	if (accountTransactions.status === 200) {
		const transactions = accountTransactions.data.result.txs.map(item => {
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
		console.log(`Account balance ${balance}`);
	}
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
		const content = 'Hello word';
		var data = new Buffer.from(content, 'utf-8');
		const tx = {
			version: 1,
			operation: 'post',
			account: account,
			params: {
				content: data,
				keys: [],
			},
			sequence: sequence,
			memo: Buffer.alloc(0),
		};
		transaction.sign(tx, privateKey);
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
		url = `${api.API_COMMIT_TRANSACTION}${txEncode}`;
		const res = await axios({
			url,
			method: 'POST',
		});
		console.log(res);
	}
};

const test = () => {
	//readAllTransactionsOfOneACcount(key.publicKey1);
	calculateAccountBalance(key.publicKey1);
	//postContent(key.publicKey1, key.privateKey1);
};

export { test };
