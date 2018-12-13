import * as v1 from './tx/v1';
import * as transaction from './tx';
import * as key from '../config/key';
import { Keypair } from 'stellar-base';
import axios from 'axios';

const testEncodeData = async () => {
	const account = key.publicKey;
	const address = 'GCVKA647ODIRXBMUI4VP4WRFDJ5BFPBOQT7LNN7XGYKW4FVMTFTUOHCX';
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
			sequence: length-1,
			memo: Buffer.alloc(0),
		};
		transaction.sign(tx, key.privateKey);
		const txEncode = '0x' + transaction.encode(tx).toString('hex');
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

const test = () => {
	testEncodeData();
};

export { test };
