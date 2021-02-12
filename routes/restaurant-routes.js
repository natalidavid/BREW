const express = require('express');
const router  = express.Router();
const axios = require("axios"); //needed for the yelp request.
let API_KEY = "y3q3LPGT4Z8NTG8gTez1pcmUrWAmZELHkzaLSISaYoq1CZpurxchYdvAph9dI4Itx5Msfpexss8dlUh_4EmfSaEgeNHShGppJqylgKumLnXzFu8bAN7rt7c1VEQjYHYx" // we'll figure out a better way for this

// REST
let yelpREST = axios.create({
  baseURL: "https://api.yelp.com/v3/",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-type": "application/json",
  },
})

module.exports = (db) => {
//put this inside of this routing to work around axios
  router.get("/yelp", (req, res) => {
//will need to figure this out right now /yelp is showing us the json object for kyoto Edmonton
    yelpREST("/businesses/search", {
      params: {
        location: "Edmonton", //this can be figured out with geotracking
        term: "kyoto", //user submission coming soon.
        limit: 20,
      },
    }).then(({ data }) => {
      const results = {};
      let { businesses } = data;
      results.businesses = businesses;

      // console.log("BUNIESS LOG:", businesses);
       const array = [];
      businesses.forEach((b) => {
        const obj = {name: b.name, Address: b.location.display_address[0,1], Phone: b.display_phone};
        array.push(obj)
        // console.log("Name: ", b.name, "Adress: ", b.location.display_address[0,1], "Phone: ", b.display_phone)
      })

      res.send(JSON.stringify(array));

    }).catch((error) => {
      console.log("HERES AN ERROR: ",error);
    })

  });

  router.get("/:id", (req, res) => {
    db.query(`
    SELECT *
    FROM items
    WHERE user_id = $1
    AND category_id = 3
    ORDER BY date_added;`, [req.params.id])
      .then(data => {
        const restaurants = data.rows;
        res.json({ restaurants });
        console.log("RES ARE LOADED")
      })
      .catch(err => {
        console.log("HERE IS THE ERROR" ,err);
        res
          .status(500)
          .json({ error: err.message});
      });
  });

  //post request to delete
  router.post("/:id/delete", (req,res) => {
    const userId = req.params.id;
    const itemId = req.body["itemId"];
    const values = [userId, itemId];

    db.query(`
    DELETE FROM items
    WHERE user_id = $1
    AND category_id = 3
    AND id = $2;`, values)
      .then(data => {
        const restaurants = data.rows;
        res.json({ restaurants });
        })
      .catch(err => {
        res
      .status(500)
      .json({ error: err.message});
    });
  });

  //post request to edit
  router.post("/:id/edit", (req,res) => {
    const userId = req.params.id;
    const itemId = req.body["itemId"];
    const categoryId = req.body["categoryId"]
    const values = [categoryId, userId, itemId]
    console.log("Thses are my values:", values)

    const editItem = `
    UPDATE items
    SET category_id = $1
    WHERE user_id = $2
    AND id = $3
    RETURNING *;`
    db.query(editItem, values)
      .then(data => {
        const restaurants = data.rows;
        res.json({ restaurants });
        })
      .catch(err => {
          console.log(err)
          res.status(500).json({ error: err.message});
        });
      });

  return router;
  };




