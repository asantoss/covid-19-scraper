'use strict';
module.exports = (sequelize, DataTypes) => {
	const country = sequelize.define(
		'country',
		{
			name: DataTypes.STRING,
			total_cases: DataTypes.INTEGER,
			new_cases: DataTypes.INTEGER,
			total_deaths: DataTypes.INTEGER,
			new_deaths: DataTypes.INTEGER,
			active_cases: DataTypes.INTEGER,
			serious_critical: DataTypes.INTEGER,
			total_cases_1m_pop: DataTypes.FLOAT,
			deaths_1m_pop: DataTypes.FLOAT,
			first_case: DataTypes.STRING,
			entry_date: DataTypes.STRING,
		},
		{}
	);
	country.associate = function (models) {
		// associations can be defined here
		country.hasMany(models.state);
	};
	return country;
};
