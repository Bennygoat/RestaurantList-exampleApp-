const express = require('express')
const { engine } = require("express-handlebars")
const app = express()
const port = 3000
const restaurants = require('./public/json/restaurant.json').results
const indexCSS = '<link href="/style/index.css" rel="stylesheet">';
const showCSS = '<link href="/style/show.css" rel="stylesheet">';

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './view')
app.use(express.static('public'))


app.get('/', (req, res) =>{
  res.redirect("/restaurants");
})

app.get("/restaurants", (req, res) => {
  const searchQuery = req.query.search;
  const keyword = searchQuery ? searchQuery.trim() : undefined;
  const matchedRestaurants = keyword ? restaurants.filter((restaurant) =>
  Object.values(restaurant).some((property) => {
    if (typeof(property) === 'string'){
      return property.toLowerCase().includes(keyword.toLowerCase())
    }
    return false
  })
  ): restaurants;
  res.render("index", {
    restaurants: matchedRestaurants,
    css: indexCSS,
    keyword,
  });
});


app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find(
    (restaurant) => restaurant.id.toString() === id
  );
  res.render("show", { restaurant, css: showCSS });
});





app.listen(port, () =>{
  console.log(`express server is running on http://localhost:${port}`)
})