import { Sequelize } from "sequelize";

const sequelize = new Sequelize("sql6686449", "sql6686449", "9EVRXtdfc8", {
  host: "sql6.freemysqlhosting.net",
  port: 3306,
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to database has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to database:", err);
  });
export const define = sequelize.define.bind(sequelize);
export default sequelize;
