const { sequelize } = require("./config");
const { theatres } = require("../data/theatres");
const { users } = require("../data/users");
const { reviews } = require("../data/reviews");
const { cities } = require("../data/cities");

const seedTheatresDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS theatre;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    await sequelize.query(`DROP TABLE IF EXISTS city`);

    /* ------------------------ Cities ------------------------------ */

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS city (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cityname TEXT NOT NULL
        );
        `);

    await sequelize.query(`
        INSERT INTO city (cityname)
        VALUES
        ("Jönköping"),
        ("Uppsala"),
        ("Stockholm");
        `);

    /* ------------------------ Users ------------------------------ */
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL
    );
    `);

    await sequelize.query(
      `INSERT INTO user (username, password, email, role)
       VALUES
       ("Jocke","hemlis","Jocke@email.com","USER"),
       ("Malin", "hemlis123", "Malin@email.com", "ADMIN"),
       ("Erik", "hemlis12", "Erik@email.com", "OWNER");
       `
    );

    /* ------------------------ Theatres ------------------------------ */

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS theatre (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          theatreName TEXT NOT NULL,
          address TEXT NOT NULL,
          phoneNumber TEXT NOT NULL,
          desc TEXT,
          email TEXT NOT NULL,
          fk_user_id INTEGER NOT NULL,
          fk_city_id INTEGER NOT NULL,
          FOREIGN KEY(fk_user_id) REFERENCES user(id),
          FOREIGN KEY(fk_city_id) REFERENCES city(id)
        );
        `);

    await sequelize.query(
      `INSERT INTO theatre (theatreName, address, phoneNumber, desc, email, fk_user_id, fk_city_id)
       VALUES
       ("Jönköpingsteater", "gatan 3", "03657574","en teater", "teater@email.com",(SELECT id FROM user WHERE username = "Erik"), (SELECT id FROM city WHERE cityname = "Jönköping")),
       ("Stockholmsteatern", "gatan 4", "03657334", "två teater", "teaterstockholm@email.com", (SELECT id FROM user WHERE username = "Erik"), (SELECT id FROM city WHERE cityname = "Stockholm"));
       `
    );

    /* ------------------------ Review ------------------------------ */

    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS review (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mainText TEXT NOT NULL,
      rating INTEGER NOT NULL,
      fk_user_id INTEGER NOT NULL,
      fk_theatre_id INTEGER NOT NULL,
      FOREIGN KEY(fk_user_id) REFERENCES user(id),
      FOREIGN KEY(fk_theatre_id) REFERENCES theatre(id)
    );
    `);

    await sequelize.query(
      `INSERT INTO review (mainText, rating, fk_user_id, fk_theatre_id) 
      VALUES
      ("ååh vilken fin teater", 5, (SELECT id FROM user WHERE username = "Malin"),(SELECT id FROM theatre WHERE theatreName = "Jönköpingsteater")),
      ("härlig teater", 5, (SELECT id FROM user WHERE username = "Jocke"),(SELECT id FROM theatre WHERE theatreName = "Stockholmsteatern")),
      ("byggnaden såg ut som bakelse", 4, (SELECT id FROM user WHERE username = "Jocke"),(SELECT id FROM theatre WHERE theatreName = "Jönköpingsteater")),
      ("salongen va väldigt konstig och trång", 2, (SELECT id FROM user WHERE username = "Malin"),(SELECT id FROM theatre WHERE theatreName = "Stockholmsteatern"));
      `
    );

    console.error(error);
  } finally {
    console.log("Script kört!");

    process.exit(0);
  }
};

seedTheatresDb();
