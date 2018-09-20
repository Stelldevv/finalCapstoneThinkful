"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://stelldevv:2pakandranger@ds119692.mlab.com:19692/final_capstone_thinkful";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://stelldevv:2pakandranger@ds263642.mlab.com:63642/node-capstone-testdb";
exports.PORT = process.env.PORT || 8080;