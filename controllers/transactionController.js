import { Op } from "sequelize";
import Transaction from "../model/transaction.js";
import sequelize from "../database/connection.js";

export async function getAllTransactions(req, res, next) {
  try {
    const { page = 1, perPage = 10, month, search = "" } = req.query;
    const offset = (page - 1) * perPage;
    const limit = parseInt(perPage);

    const inputMonth = parseInt(month);
    if (isNaN(inputMonth) || inputMonth < 1 || inputMonth > 12) {
      return res.status(400).json({ error: "Invalid month value" });
    }

    const transactions = await Transaction.findAndCountAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("dateOfSale")),
            month
          ),
          {
            [Op.or]: [
              { title: { [Op.like]: `%${search}%` } },
              { description: { [Op.like]: `%${search}%` } },
              { price: { [Op.like]: `%${search}%` } },
            ],
          },
        ],
      },
      offset,
      limit,
    });

    return res.json(transactions);
  } catch (error) {
    next(error);
    return;
  }
}

export async function getStatistics(req, res, next) {
  try {
    const { month } = req.query;
    const inputMonth = parseInt(month);
    if (isNaN(inputMonth) || inputMonth < 1 || inputMonth > 12) {
      return res.status(400).json({ error: "Invalid month value" });
    }
    const totalSaleAmount = await Transaction.sum("price", {
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("dateOfSale")),
            month
          ),
          { sold: true },
        ],
      },
    });

    const totalSoldItems = await Transaction.count({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("dateOfSale")),
            month
          ),
          { sold: true },
        ],
      },
    });

    const totalNotSoldItems = await Transaction.count({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("dateOfSale")),
            month
          ),
          { sold: false },
        ],
      },
    });

    return res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    next(error);
    return;
  }
}

export async function getBarChartData(req, res, next) {
  try {
    const { month } = req.query;
    const inputMonth = parseInt(month);
    if (isNaN(inputMonth) || inputMonth < 1 || inputMonth > 12) {
      return res.status(400).json({ error: "Invalid month value" });
    }
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Transaction.count({
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("MONTH", sequelize.col("dateOfSale")),
                month
              ),

              {
                price: {
                  [Op.between]: [range.min, range.max],
                },
              },
            ],
          },
        });
        return {
          priceRange: `${range.min}-${range.max}`,
          count,
        };
      })
    );

    return res.json(barChartData);
  } catch (error) {
    next(error);
    return;
  }
}

export async function getPieChartData(req, res, next) {
  try {
    const { month } = req.query;
    const inputMonth = parseInt(month);
    if (isNaN(inputMonth) || inputMonth < 1 || inputMonth > 12) {
      return res.status(400).json({ error: "Invalid month value" });
    }
    const categories = await Transaction.findAll({
      attributes: ["category"],
      where: sequelize.where(
        sequelize.fn("MONTH", sequelize.col("dateOfSale")),
        month
      ),
    });

    const categoryCounts = await categories.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    return res.json(categoryCounts);
  } catch (error) {
    next(error);
    return;
  }
}

export async function getCombinedData(req, res, next) {
  try {
    const statisticsPromise = await getStatistics(req, res, next);
    const barChartDataPromise = await getBarChartData(req, res, next);
    const pieChartDataPromise = await getPieChartData(req, res, next);

    const [statistics, barChartData, pieChartData] = await Promise.all([
      statisticsPromise,
      barChartDataPromise,
      pieChartDataPromise,
    ]);

    const combinedData = {
      statistics,
      barChartData,
      pieChartData,
    };
    return res.json(combinedData);
  } catch (error) {
    next(error);
    return;
  }
}
