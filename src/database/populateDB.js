const { sequelize } = require("./config");
const { theatres } = require("../data/theatres");
const { users } = require("../data/users");
const { reviews } = require("../data/reviews");
const { cities } = require("../data/cities");

const bcrypt = require("bcrypt");

const seedTheatresDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS theatre;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    await sequelize.query(`DROP TABLE IF EXISTS city`);

    // Hashing passwords

    let joakimPassword = "password";
    const joakimsalt = await bcrypt.genSalt(10);
    const joakimHash = await bcrypt.hash(joakimPassword, joakimsalt);

    let malinPassword = "Malin123";
    const malinsalt = await bcrypt.genSalt(10);
    const malinHash = await bcrypt.hash(malinPassword, malinsalt);

    let erikPassword = "ErikSecret";
    const eriksalt = await bcrypt.genSalt(10);
    const erikHash = await bcrypt.hash(erikPassword, eriksalt);

    let henrikPassword = "ManOfSteel";
    const henriksalt = await bcrypt.genSalt(10);
    const henrikHash = await bcrypt.hash(henrikPassword, henriksalt);

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
       ("Joakim Fenix","${joakimHash}","Jocke@email.com","USER"),

       ("Malin Åkerman", "${malinHash}", "Malin@email.com", "ADMIN"),

       ("Erik Garbo", "${erikHash}", "Erik@email.com", "OWNER"),

       ("Henrik Kavel", "${henrikHash}", "Henrik@email.com", "OWNER");
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
          FOREIGN KEY(fk_user_id) REFERENCES user(id) ON DELETE CASCADE,
          FOREIGN KEY(fk_city_id) REFERENCES city(id)
        );
        `);

    await sequelize.query(
      `INSERT INTO theatre (theatreName, address, phoneNumber, desc, email, fk_user_id, fk_city_id)
       VALUES
       ("Jönköpings teater", "Hovrättstorget, 553 21 Jönköping", "077-121 13 00","Jönköpings Teater är en teater i Jönköping som även används till koncerter. Den öppnades 2 December 1904.", "jkpgteater@outlook.com",(SELECT id FROM user WHERE username = "Erik Garbo"), (SELECT id FROM city WHERE cityname = "Jönköping")),

       ("Kulturhuset stadsteatern", "Sergels Torg Norrmalm, 111 57 Stockholm", "08-506 202 00", "Stadsteatern är en teater som ligger inuti Stockholms kulturhus. Byggnaden ligger även i anslutning till Sergelstorg.", "stadsteater@gmail.com", (SELECT id FROM user WHERE username = "Erik Garbo"), (SELECT id FROM city WHERE cityname = "Stockholm")),

       ("Uppsala stadsteater", "Kungsgatan 53, 753 21 Uppsala", "018-14 62 00", "Uppsala stadsteater är Sveriges tredje största stadsteater. Vi producerar ett brett program med klassiker och ny dramatik som speglar vår samtid. Här finns något för alla! Alltifrån ny utmanande scenkonst till familjeföreställningar. Storslagna teaterupplevelser på Stora scenen och nära möten med våra skådespelare i monologer på våra mindre scener.", "Uppsalastadsteater@live.se", (SELECT id FROM user WHERE username = "Henrik Kavel"), (SELECT id FROM city WHERE cityname = "Uppsala"));
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
      FOREIGN KEY(fk_user_id) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY(fk_theatre_id) REFERENCES theatre(id)
    );
    `);

    await sequelize.query(
      `INSERT INTO review (mainText, rating, fk_user_id, fk_theatre_id) 
      VALUES
      ("Vacker liten teater belägen i centrala Uppsala, framför tågstationen. Det finns en restaurang också inne i teatern.", 5, (SELECT id FROM user WHERE username = "Malin Åkerman"),(SELECT id FROM theatre WHERE theatreName = "Jönköpings teater")),

      ("Vi brukade gå till biblioteksområdet där det fanns en fantastisk liten lekplats för barn.", 5, (SELECT id FROM user WHERE username = "Joakim Fenix"),(SELECT id FROM theatre WHERE theatreName = "Kulturhuset stadsteatern")),

      ("Gammal, traditionell teater, fortfarande i gott skick. Byggnaden såg ut som en bakelse.", 4, (SELECT id FROM user WHERE username = "Joakim Fenix"),(SELECT id FROM theatre WHERE theatreName = "Jönköpings teater")),

      ("salongen va väldigt konstig och trång", 2, (SELECT id FROM user WHERE username = "Malin Åkerman"),(SELECT id FROM theatre WHERE theatreName = "Kulturhuset stadsteatern"));
      `
    );

    console.error(error);
  } finally {
    console.log("Script klart!");

    process.exit(0);
  }
};

seedTheatresDb();
