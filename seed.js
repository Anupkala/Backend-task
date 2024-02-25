import axios from "axios";
import Transaction from "./model/transaction.js";
import sequelize from "./database/connection.js";

async function seedData() {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = response.data;
    await sequelize.sync({ force: true });
    await Transaction.bulkCreate(data);
    console.log("Data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
