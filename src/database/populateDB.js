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

       ("Uppsala stadsteater", "Kungsgatan 53, 753 21 Uppsala", "018-14 62 00", "Uppsala stadsteater är Sveriges tredje största stadsteater. Vi producerar ett brett program med klassiker och ny dramatik som speglar vår samtid. Här finns något för alla! Alltifrån ny utmanande scenkonst till familjeföreställningar. Storslagna teaterupplevelser på Stora scenen och nära möten med våra skådespelare i monologer på våra mindre scener.", "Uppsalastadsteater@live.se", (SELECT id FROM user WHERE username = "Henrik Kavel"), (SELECT id FROM city WHERE cityname = "Uppsala")),
       
       ("Kulturhuset Spira", "Kulturgatan 3, 553 24 Jönköping", "010-242 80 80", "Här presenterar Smålands Musik och Teater ett varierat utbud av musikal, musik, teater och dans för barn, ungdomar och vuxna, i och utanför Jönköpings län", "spira@jönkmail.se", (SELECT id FROM user WHERE username = "Henrik Kavel"), (SELECT id FROM city WHERE cityname = "Jönköping")),

       ("Huskvarna teater", "Jönköpingsvägen 17, 561 31 Huskvarna", "08-590 812 63", "Föreningen Teater i Huskvarna bildades den 14 juni 1993 för att främja ett allsidigt teaterliv i Huskvarna", "Öxne4lyfe@huskmail.se", (SELECT id FROM user WHERE username = "Henrik Kavel"), (SELECT id FROM city WHERE cityname = "Jönköping")),

       ("Reginateatern", "Trädgårdsgatan 6, 753 09 Uppsala", "0187278340", "Tidigare känd som scandiascenen.", "reginateatern@uppsala.se", (SELECT id FROM user WHERE username = "Henrik Kavel"), (SELECT id FROM city WHERE cityname = "Uppsala")),

       ("Spraka teatern", "Salagatan 24, 753 30 Uppsala", "08-590 815 43", "En enkel och mysig teater i ett garage.", "spraka@email.se", (SELECT id FROM user WHERE username = "Henrik Kavel"), (SELECT id FROM city WHERE cityname = "Uppsala")),

       ("Den lilla teatern", "S:t Persgatan 22, 753 29 Uppsala", "018-13 15 56", "Uppsalas scen för barnkultur. Sedan mer än 30 år navet för Uppsalas barnkultur med många gästspel från hela landet på helg som på vardag", "denlillateatern@hotmail.se", (SELECT id FROM user WHERE username = "Henrik Kavel"), (SELECT id FROM city WHERE cityname = "Uppsala")),

       ("Chinateatern", "Berzelii park 9, 111 47 Stockholm", "08-562 892 00", "En privatägd teater i nära anslutning till Berns", "china@chinamail.se", (SELECT id FROM user WHERE username = "Erik Garbo"), (SELECT id FROM city WHERE cityname = "Stockholm")),

       ("Intiman", "Odengatan 81, 113 22 Stockholm", "08-542 882 10", "Ända sedan 1950 har Intiman varit teaterlokal. En mysig och intim teater mitt på Odenplan i Stockholm", "intiman@email.se", (SELECT id FROM user WHERE username = "Erik Garbo"), (SELECT id FROM city WHERE cityname = "Stockholm")),

       ("Göta Lejon", "Götgatan 55, 116 21 Stockholm", "08-505 290 00", "Göta Lejon är en teater- och biografbyggnad i stadsdelen Södermalm i Stockholm", "gotalejon@email.se", (SELECT id FROM user WHERE username = "Erik Garbo"), (SELECT id FROM city WHERE cityname = "Stockholm"));
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
      FOREIGN KEY(fk_theatre_id) REFERENCES theatre(id) ON DELETE CASCADE
    );
    `);

    await sequelize.query(
      `INSERT INTO review (mainText, rating, fk_user_id, fk_theatre_id) 
      VALUES
      (
        "Vacker liten teater belägen i centrala Uppsala, framför tågstationen. Det finns en restaurang också inne i teatern.",
        5,
        (SELECT id FROM user WHERE username = "Malin Åkerman"),
        (SELECT id FROM theatre WHERE theatreName = "Jönköpings teater")
      ),

      (
        "Gammal, traditionell teater, fortfarande i gott skick. Byggnaden såg ut som en bakelse.",
        4,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Jönköpings teater")
      ),

      (
        "Jönköpingsteatern är en fantastisk teater med en imponerande lokal. Scenen är rymlig och akustiken är utmärkt, vilket gör att föreställningarna blir mycket uppslukande. Personalen är också mycket hjälpsam och välkomnande. Biljettpriserna kan vara högre än andra teatrar i Jönköping, men det är definitivt värt det för den höga kvaliteten på föreställningarna.",
        4,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Jönköpings teater")
      ),

      (
        "Jag hade en fantastisk upplevelse på Jönköpingsteatern! Teatern har en vacker interiör och personalen var mycket hjälpsam och vänlig. Jag såg en musikal som var mycket välregisserad och spelad av talangfulla skådespelare. Scenografin och ljusdesignen var också imponerande och bidrog till att skapa en verkligt magisk upplevelse. Jag skulle definitivt rekommendera Jönköpingsteatern till alla som söker en högkvalitativ teaterupplevelse i Jönköping.",
        5,
        (SELECT id FROM user WHERE username = "Henrik Kavel"),
        (SELECT id FROM theatre WHERE theatreName = "Jönköpings teater")
      ),

      (
        "Vi brukade gå till biblioteksområdet där det fanns en fantastisk liten lekplats för barn.",
        5,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Kulturhuset stadsteatern")
      ),

      (
        "salongen va väldigt konstig och trång",
        2,
        (SELECT id FROM user WHERE username = "Malin Åkerman"),
        (SELECT id FROM theatre WHERE theatreName = "Kulturhuset stadsteatern")
      ),

      (
        "China Teatern är ett av Stockholms äldsta teatrar och erbjuder en vacker och unik miljö för föreställningar. Sätet är dock inte det mest bekväma och teatern kan bli lite varm under sommarmånaderna.",
        3,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Chinateatern")
      ),

      (
        "Jag var väldigt besviken på min upplevelse på Göta Lejon. Teaterns lokaler är gamla och slitet, och det var tydligt att underhållet inte var prioriterat. Sätet var mycket obekvämt, vilket gjorde det svårt att sitta still under hela föreställningen. Ljud- och ljuskvaliteten var också ganska dålig, vilket gjorde att jag hade svårt att följa med i handlingen. För priset jag betalade för biljetten förväntade jag mig en bättre upplevelse. Sammanfattningsvis skulle jag inte rekommendera Göta Lejon till någon som söker en högkvalitativ teaterupplevelse i Stockholm.",
        1,
        (SELECT id FROM user WHERE username = "Henrik Kavel"),
        (SELECT id FROM theatre WHERE theatreName = "Göta Lejon")
      ),

      (
        "Denna historiska teater är ett måste för alla som är intresserade av teaterhistoria. Produktionerna här är alltid väl utförda och själva utrymmet är fantastiskt.",
        4,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Göta Lejon")
      ),

      (
        "Den lilla teatern stämmer verkligen överens med namnet... den va väldigt liten.. men kaffet va gott i pausen på föreställningen, så tack för det!",
        3,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Den lilla teatern")
      ),

      (
        "Väldigt konstig inredning, vem i h*lvete bestämde färgkombinationerna? Nej, blev nästan yr av att befinna mig på den här teatern.... kommer välja en annan teater nästa gång!",
        1,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Den lilla teatern")
      ),

      (
        "Jag hade en fantastisk upplevelse på Sprakateatern i Uppsala! Teaterns lokal är intim och mysig, vilket skapar en verkligt personlig teaterupplevelse. Jag såg en pjäs som var mycket välspelad och välregisserad av skickliga skådespelare. Jag uppskattade också att teatern hade valt att använda sig av flera olika språk i föreställningen, vilket bidrog till en kulturellt rik och spännande upplevelse. Personalen var också mycket välkomnande och hjälpsam. Jag skulle definitivt rekommendera Sprakateatern till alla som söker en högkvalitativ teaterupplevelse i Uppsala!",
        5,
        (SELECT id FROM user WHERE username = "Henrik Kavel"),
        (SELECT id FROM theatre WHERE theatreName = "Spraka teatern")
      ),

      (
        "Denna teater är en riktig pärla. Föreställningarna här är alltid toppklass och personalen är otroligt vänlig och välkomnande.",
        4,
        (SELECT id FROM user WHERE username = "Erik Garbo"),
        (SELECT id FROM theatre WHERE theatreName = "Spraka teatern")
      ),

      (
        "Mysig liten teater, kommer garanterat tillbaka!",
        4,
        (SELECT id FROM user WHERE username = "Malin Åkerman"),
        (SELECT id FROM theatre WHERE theatreName = "Intiman")
      ),

      (
        "Lite trång i foajen, trevlig personal och fantastiska skådespelare",
        3,
        (SELECT id FROM user WHERE username = "Henrik Kavel"),
        (SELECT id FROM theatre WHERE theatreName = "Intiman")
      ),

      (
        "Tack för en fin vistelse, kommer garanterat tillbaka!",
        4,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Uppsala stadsteater")
      ),

      (
        "Stor besvikelse över hur scenen såg ut... den va väldigt sliten och gammal, kanske behövs en renovering?",
        2,
        (SELECT id FROM user WHERE username = "Joakim Fenix"),
        (SELECT id FROM theatre WHERE theatreName = "Huskvarna teater")
      ),

      (
        "Härlig atmosfär, luftig lokal och trevlig personal. Otroligt fin föreställning!",
        4,
        (SELECT id FROM user WHERE username = "Malin Åkerman"),
        (SELECT id FROM theatre WHERE theatreName = "Kulturhuset Spira")
      ),

      (
        "Lite besviken på föreställningen... de har dock fräscha toaletter, det är ju ett plus!",
        4,
        (SELECT id FROM user WHERE username = "Erik Garbo"),
        (SELECT id FROM theatre WHERE theatreName = "Kulturhuset Spira")
      ),

      (
        "Den här teater var något utöver det vanliga, fantastisk att det kan finnas en sån teater i en liten stad som Huskvarna. Jag kommer garanterat komma hit fler gånger!",
        2,
        (SELECT id FROM user WHERE username = "Erik Garbo"),
        (SELECT id FROM theatre WHERE theatreName = "Huskvarna teater")
      ),

      (
        "Wow, väldigt imponerad av den här teatern! bra personal, bra mat, bra dryck och fantastiska skådespelare.",
        4,
        (SELECT id FROM user WHERE username = "Henrik Kavel"),
        (SELECT id FROM theatre WHERE theatreName = "Uppsala stadsteater")
      ),

      (
        "Jag såg föreställningen Bodyguard, båda huvudrollsinnehavarna hade underbara sångröster. Den här föreställningen rekommenderar jag starkt!!",
        3,
        (SELECT id FROM user WHERE username = "Malin Åkerman"),
        (SELECT id FROM theatre WHERE theatreName = "Chinateatern")
      ),

      (
        "Klassisk & genuin teater. Mysigt att det gamla var bevarat.",
        4,
        (SELECT id FROM user WHERE username = "Henrik Kavel"),
        (SELECT id FROM theatre WHERE theatreName = "Reginateatern")
      );
      `
    );

    console.error(error);
  } finally {
    console.log("Script klart!");

    process.exit(0);
  }
};

seedTheatresDb();
