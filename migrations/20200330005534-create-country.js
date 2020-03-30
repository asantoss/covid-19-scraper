'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('countries', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
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
			serious_critical: {
				type: Sequelize.INTEGER
			},
			total_cases_1m_pop: {
				type: Sequelize.FLOAT
			},
			deaths_1m_pop: {
				type: Sequelize.FLOAT
			},
			first_case: {
				type: Sequelize.STRING
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
		return queryInterface.dropTable('countries');
	}
};
