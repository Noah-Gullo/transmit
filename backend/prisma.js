const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./generated/prisma");

// Temporary debugging
const dbUrl = new URL(process.env.DATABASE_URL);

console.log("DB host:", dbUrl.hostname);
console.log("DB port:", dbUrl.port);
console.log("DB name:", dbUrl.pathname);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;