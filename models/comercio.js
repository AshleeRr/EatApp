import { DataTypes } from "sequelize"
import bcrypt from "bcrypt"

export default (sequelize) => {
  const Comercio = sequelize.define(
    "Comercio",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      opening: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      closing: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
       userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    },{
      tableName: "Comercio"
    },
    {
      hooks: {
        beforeCreate: async (comercio) => {
          if (comercio.password) {
            const salt = await bcrypt.genSalt(10)
            comercio.password = await bcrypt.hash(comercio.password, salt)
          }
        },
        beforeUpdate: async (comercio) => {
          if (comercio.changed("password")) {
            const salt = await bcrypt.genSalt(10)
            comercio.password = await bcrypt.hash(comercio.password, salt)
          }
        },
      },
    },
  )

  Comercio.prototype.validarPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  Comercio.associate = (models) => {
    Comercio.belongsTo(models.TipoComercio, {
      foreignKey: "tipoComercioId",
      as: "tipoComercio",
    })

    Comercio.hasMany(models.Categoria, {
      foreignKey: "comercioId",
      as: "categorias",
    })

    Comercio.hasMany(models.Producto, {
      foreignKey: "comercioId",
      as: "productos",
    })

    Comercio.hasMany(models.Pedido, {
      foreignKey: "comercioId",
      as: "pedidos",
    })

    Comercio.hasMany(models.Favorito, {
      foreignKey: "comercioId",
      as: "favoritos",
    })
  }

  return Comercio
}
