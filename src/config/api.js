const HOST = 'gorilla.forest.network';
const HOST2 = 'zebra.forest.network';
const HOST3 = 'komodo.forest.network';
const HOST4 = 'dragonfly.forest.network';
const API_COMMIT_TRANSACTION = `https://${HOST3}/broadcast_tx_commit?tx=`;
const API_GET_ACCOUNT_TRANSACTIONS = `https://${HOST3}/tx_search?query=%22account=%27`;
const API_BLOCK_HEIGHT = `https://${HOST3}/block?height=`;
const API_GET_TX_FROM_HASH = `https://${HOST3}/tx?hash=0x`;
const API_GET_ALL_COMMENT = `https://${HOST3}/tx_search?query=%22object=%27`;

export {
	API_GET_TX_FROM_HASH,
	API_COMMIT_TRANSACTION,
	API_GET_ACCOUNT_TRANSACTIONS,
	API_BLOCK_HEIGHT,
	API_GET_ALL_COMMENT,
	HOST,
	HOST2,
	HOST3,
	HOST4,
};
