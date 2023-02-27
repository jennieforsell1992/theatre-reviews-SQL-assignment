const { sequelize } = require("./config");
const { theatres } = require("../data/theatres");

const seedTheatresDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS theatre;`);

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS theatre (
          number INTEGER PRIMARY KEY AUTOINCREMENT,
          theatreName TEXT NOT NULL,
          address TEXT NOT NULL,
          phoneNumber TEXT NOT NULL,
          desc TEXT,
          email TEXT NOT NULL,
          reviews TEXT
        );
        `);

    let theatreInsertQuery =
      "INSERT INTO theatre (theatreName, address, phoneNumber, desc, email, reviews) VALUES ";

    let theatreInsertQueryVariables = [];

    theatres.forEach((theatre, index, array) => {
      let string = "(";
      for (let i = 1; i < 7; i++) {
        string += `$${theatreInsertQueryVariables.length + i}`;
        if (i < 6) string += ",";
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
      theatreInsertQueryVariables = [
        ...theatreInsertQueryVariables,
        ...variables,
      ];
    });

    theatreInsertQuery += ";";

    await sequelize.query(theatreInsertQuery, {
      bind: theatreInsertQueryVariables,
    });

    const [theatresResponse, metadata] = await sequelize.query(
      "SELECT * FROM theatre"
    );

    //Nästa tabell
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

seedTheatresDb();
