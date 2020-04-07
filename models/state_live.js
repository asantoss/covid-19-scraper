'use strict';
module.exports = (sequelize, DataTypes) => {
  const state_live = sequelize.define('state_live', {
    name: DataTypes.STRING,
    total_cases: DataTypes.INTEGER,
    new_deaths: DataTypes.INTEGER,
    active_cases: DataTypes.INTEGER
  }, {});
  state_live.associate = function(models) {
    // associations can be defined here
  };
  return state_live;
};