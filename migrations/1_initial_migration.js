var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
	Migrations.synchronization_timeout = 3600;
	deployer.deploy(Migrations);
};