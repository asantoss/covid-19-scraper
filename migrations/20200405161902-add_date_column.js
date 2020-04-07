'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
		return queryInterface
			.addColumn('states', 'entry_date', {
				type: Sequelize.STRING,
			})
			.then(() => {
				return queryInterface.addColumn('countries', 'entry_date', {
					type: Sequelize.STRING,
				});
			});
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
		return queryInterface.removeColumn('states', 'entry_date').then(() => {
			return queryInterface.removeColumn('countries', 'entry_date');
		});
	},
};
