'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('country_lives', {
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
        type: Sequelize.INTEGER
      },
      deaths_1m_pop: {
        type: Sequelize.INTEGER
      },
      first_case: {
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
    return queryInterface.dropTable('country_lives');
  }
};