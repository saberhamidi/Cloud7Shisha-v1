module.exports = {
	//database: 'mongodb://testuser:9eVH8YT0rVZ0X1uj@cluster0-shard-00-00.ecaql.mongodb.net:27017,cluster0-shard-00-01.ecaql.mongodb.net:27017,cluster0-shard-00-02.ecaql.mongodb.net:27017/BLOGAPP?ssl=true&replicaSet=atlas-ceza4t-shard-0&authSource=admin&retryWrites=true&w=majority',
	database: "mongodb://"+process.env.DBENDPOINT+":"+process.env.DBPORT,
	secret: 'mysec'
}