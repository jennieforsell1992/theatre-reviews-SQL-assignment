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

    let cityInsertQuery = " INSERT INTO city (cityname) VALUES ";
    let cityInsertQueryVariables = [];

    cities.forEach((city, index, array) => {
      let string = "(";
      for (let i = 1; i < 2; i++) {
        string += `$${cityInsertQueryVariables.length + i}`;
        if (i < 1) string += ",";
      }
      cityInsertQuery += string + ")";
      if (index < array.length - 1) cityInsertQuery += ",";

      const variables = [city.cityname];
      cityInsertQueryVariables = [...cityInsertQueryVariables, ...variables];
    });

    cityInsertQuery += ";";

    await sequelize.query(cityInsertQuery, {
      bind: cityInsertQueryVariables,
    });

    const [cityResponse] = await sequelize.query("SELECT id FROM city");
    console.log(cityResponse);

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

    let userInsertQuery =
      "INSERT INTO user (username, password, email, role) VALUES ";

    let userInsertQueryVariables = [];

    users.forEach((user, index, array) => {
      let string = "(";
      for (let i = 1; i < 5; i++) {
        string += `$${userInsertQueryVariables.length + i}`;
        if (i < 4) string += ",";
      }
      userInsertQuery += string + ")";
      if (index < array.length - 1) userInsertQuery += ",";

      const variables = [user.username, user.password, user.email, user.role];
      userInsertQueryVariables = [...userInsertQueryVariables, ...variables];
    });

    userInsertQuery += ";";

    await sequelize.query(userInsertQuery, {
      bind: userInsertQueryVariables,
    });

    const [userResponse, metadata] = await sequelize.query(
      "SELECT username, id FROM user"
    );
    console.log("Users klar!");

    /* ------------------------ Theatres ------------------------------ */

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS theatre (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          theatreName TEXT NOT NULL,
          address TEXT NOT NULL,
          phoneNumber TEXT NOT NULL,
          desc TEXT,
          email TEXT NOT NULL,
          reviews TEXT,
          fk_user_id INTEGER NOT NULL,
          fk_city_id INTEGER NOT NULL,
          FOREIGN KEY(fk_user_id) REFERENCES user(id),
          FOREIGN KEY(fk_city_id) REFERENCES city(id)
        );
        `);

    let theatreInsertQuery =
      "INSERT INTO theatre (theatreName, address, phoneNumber, desc, email, reviews, fk_user_id, fk_city_id) VALUES ";

    let theatreInsertQueryVariables = [];

    theatres.forEach((theatre, index, array) => {
      let string = "(";
      for (let i = 1; i < 9; i++) {
        string += `$${theatreInsertQueryVariables.length + i}`;
        if (i < 8) string += ",";
      }
      theatreInsertQuery += string + ")";
      if (index < array.length - 1) theatreInsertQuery += ",";

      const variables = [
        theatre.theatreName,
        theatre.address,
        theatre.phoneNumber,
        theatre.desc,
        theatre.email,
        theatre.reviews,
      ];

      const cityId = cityResponse.find((city) => {
        city.id === theatre.fk_city_id;
        return city.id;
      });

      console.log("Hello " + cityId);

      variables.push(cityId.id);

      const userId = userResponse.find(
        (user) => user.username === theatre.owner
      );

      variables.push(userId.id);
      theatreInsertQueryVariables = [
        ...theatreInsertQueryVariables,
        ...variables,
      ];
    });

    theatreInsertQuery += ";";

    await sequelize.query(theatreInsertQuery, {
      bind: theatreInsertQueryVariables,
    });

    const [theatreResponse] = await sequelize.query(
      "SELECT id, theatreName FROM theatre"
    );

    console.log("Theatres klar!");

    /* ------------------------ Review ------------------------------ */
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS review (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mainText TEXT NOT NULL,
      rating INTEGER NOT NULL,
      fk_user_id INTEGER,
      fk_theatre_id INTEGER,

      FOREIGN KEY(fk_user_id) REFERENCES user(id),
      FOREIGN KEY(fk_theatre_id) REFERENCES theatre(id)
    );
    `);

    let reviewInsertQuery =
      "INSERT INTO review (mainText, rating, fk_user_id, fk_theatre_id) VALUES ";

    let reviewInsertQueryVariables = [];

    reviews.forEach((review, index, array) => {
      let string = "(";
      for (let i = 1; i < 5; i++) {
        string += `$${reviewInsertQueryVariables.length + i}`;
        if (i < 4) string += ",";
      }
      reviewInsertQuery += string + ")";
      if (index < array.length - 1) reviewInsertQuery += ",";

      const variables = [review.mainText, review.rating];

      // kopplar till en user
      const userId = userResponse.find(
        (user) => user.username === review.reviewer
      );

      variables.push(userId.id);

      //kopplar till en teater
      const theatreId = theatreResponse.find(
        (theatre) => theatre.theatreName === review.theatre
      );

      variables.push(theatreId.id);
      reviewInsertQueryVariables = [
        ...reviewInsertQueryVariables,
        ...variables,
      ];
    });

    reviewInsertQuery += ";";

    await sequelize.query(reviewInsertQuery, {
      bind: reviewInsertQueryVariables,
    });

    console.log("Reviews klar!");
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Script kört!");

    process.exit(0);
  }
};

seedTheatresDb();
