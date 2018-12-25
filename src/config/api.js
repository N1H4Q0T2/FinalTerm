const HOST = 'gorilla.forest.network';
const HOST2 = 'zebra.forest.network';
const HOST3 = 'komodo.forest.network';
const HOST4 = 'dragonfly.forest.network';
const API_COMMIT_TRANSACTION = `https://${HOST3}/broadcast_tx_commit?tx=`;
const API_GET_ACCOUNT_TRANSACTIONS = `https://${HOST3}/tx_search?query=%22account=%27`;
const API_BLOCK_HEIGHT = `https://${HOST3}/block?height=`;

export {
	API_COMMIT_TRANSACTION,
	API_GET_ACCOUNT_TRANSACTIONS,
	API_BLOCK_HEIGHT,
	HOST,
	HOST2,
	HOST3,
	HOST4,
};
