const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo.
// Luego le inyectamos la conexion a sequelize.
// El modelo es una tabla en la DB.
module.exports = (sequelize) => {
  // defino el modelo
  let DietType = sequelize.define('DietType', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: false, //Para evitar crear updatedAt y createdAt
  });
  return DietType;
};
