import { DataTypes } from "sequelize";
import { define } from "../database/connection.js";

const Transaction = define("Transaction", {
  dateOfSale: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  category: {
    type: DataTypes.STRING,
  },
  sold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Transaction;
