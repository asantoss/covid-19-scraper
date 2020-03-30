'use strict';
module.exports = (sequelize, DataTypes) => {
	const state = sequelize.define(
		'state',
		{
			name: DataTypes.STRING,
			total_cases: DataTypes.INTEGER,
			new_cases: DataTypes.INTEGER,
			total_deaths: DataTypes.INTEGER,
			new_deaths: DataTypes.INTEGER,
			active_cases: DataTypes.INTEGER
		},
		{}
	);
	state.associate = function(models) {
		// associations can be defined here
		state.belongsTo(models.country, {
			onDelete: 'CASCADE'
		});
	};
	return state;
};
