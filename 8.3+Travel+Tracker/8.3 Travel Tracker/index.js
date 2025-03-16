import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123madiha",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Helper function to check visited countries
async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  return result.rows.map(row => row.country_code);
}

// Home route
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

// Insert new country
app.post("/add", async (req, res) => {
  try {
    const input = req.body["country"].trim(); // Remove extra spaces
    console.log("User input:", input);

    // Case-insensitive search for country code
    const result = await db.query(
      "SELECT country_code FROM countries WHERE country_name ILIKE $1",
      [input]
    );

    if (result.rows.length === 0) {
      console.log("Country not found in DB.");
      return res.send("Country not found in database. Check the spelling.");
    }

    const countryCode = result.rows[0].country_code;
    console.log("Country found, inserting:", countryCode);

    // Check if country already exists in visited_countries
    const checkExisting = await db.query(
      "SELECT 1 FROM visited_countries WHERE country_code = $1",
      [countryCode]
    );

    if (checkExisting.rows.length > 0) {
      console.log("Country already visited.");
      return res.send("Country already added!");
    }

    // Insert country into visited_countries
    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES ($1)",
      [countryCode]
    );

    res.redirect("/");
  } catch (err) {
    console.error("Error inserting country:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
