'use strict';
module.exports = (sequelize, DataTypes) => {
  const country_live = sequelize.define('country_live', {
    name: DataTypes.STRING,
    total_cases: DataTypes.INTEGER,
    new_deaths: DataTypes.INTEGER,
    active_cases: DataTypes.INTEGER,
    serious_critical: DataTypes.INTEGER,
    total_cases_1m_pop: DataTypes.INTEGER,
    deaths_1m_pop: DataTypes.INTEGER,
    first_case: DataTypes.INTEGER
  }, {});
  country_live.associate = function(models) {
    // associations can be defined here
  };
  return country_live;
};