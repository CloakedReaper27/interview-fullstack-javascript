CREATE TABLE IF NOT EXISTS city (
  uuid VARCHAR(60) PRIMARY KEY,
  cityName VARCHAR(60) UNIQUE NOT NULL,
  count INT NOT NULL
);

-- Datadase name is: cities_app
