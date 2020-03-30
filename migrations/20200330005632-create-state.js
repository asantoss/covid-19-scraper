'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('states', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			total_cases: {
				type: Sequelize.INTEGER
			},
			new_cases: {
				type: Sequelize.INTEGER
			},
			total_deaths: {
				type: Sequelize.INTEGER
			},
			new_deaths: {
				type: Sequelize.INTEGER
			},
			active_cases: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('states');
	}
};
