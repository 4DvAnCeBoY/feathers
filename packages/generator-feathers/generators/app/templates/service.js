'use strict';

<% for (var i = 0; i < services.length; i++) { %>const <%= services[i] %> = require('./<%= services[i] %>');
<% } %>
<% if (database === 'sqlite') { %>
const path = require('path');
const fs = require('fs-extra');<% } %><% if (database === 'mongodb') { %>const mongoose = require('mongoose');<% } %><% if (database === 'sqlite' || database === 'mssql' || database === 'postgres' || database === 'mysql' || database === 'mariadb') { %>const Sequelize = require('sequelize');<% } %>

module.exports = function() {
  const app = this;
  <% if (database === 'sqlite') { %>
  fs.ensureDirSync( path.dirname(app.get('sqlite')) );
  const sequelize = new Sequelize('feathers', null, null, {
    dialect: 'sqlite',
    storage: app.get('sqlite'),
    logging: false
  });<% } else if (database === 'mssql') { %>
  const sequelize = new Sequelize('feathers', {
    dialect: '<%= database %>',
    host: 'localhost',
    port: 1433,
    logging: false,
    dialectOptions: {
      instanceName: 'feathers'
    }
  });<% } else if (database === 'postgres' || database === 'mysql' || database === 'mariadb') { %>
  const sequelize = new Sequelize(app.get('<%= database %>'), {
    dialect: '<%= database %>',
    logging: false
  });
  <% } else if (database === 'mongodb') { %>
  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;<% } %><% if (database === 'sqlite' || database === 'mssql' || database === 'postgres' || database === 'mysql' || database === 'mariadb') { %>
  app.set('sequelize', sequelize);<% } %>
  <% for (var i = 0; i < services.length; i++) { %>
  app.configure(<%= services[i] %>);<% } %>
};