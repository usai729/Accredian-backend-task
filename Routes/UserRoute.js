const Router = require("express").Router();
const bcrypt = require("bcrypt");
const { con } = require("../config");

con.connect(() => {
  console.log(`Connected to database\n`);
});

Router.route("/register").post(async (req, res) => {
  const { email, password, username } = req.body;

  con.query(
    "SELECT * FROM users WHERE email=? OR username=?",
    [email, username],
    async (error, result) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          msg: "err/Internal Error",
        });
      }

      if (result.length > 0) {
        return res.json({
          msg: "err/User Exists",
        });
      }

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      con.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hash],
        (insertError) => {
          if (insertError) {
            console.error(insertError);

            return res.json({
              msg: "err/Internal Error",
            });
          }

          return res.json({
            msg: "sucess/User Registered Successfully",
          });
        }
      );
    }
  );
});

//A log in token can be generated using JWT.
/*
const jwt = require("jsonwebtoken");

jwt.sign({id: userid}, 'SECRET')
*/
Router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;

  con.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (error, result) => {
      if (error) {
        console.error(error);

        return res.json({
          msg: "err/Internal Error",
        });
      }

      if (result.length === 0) {
        return res.json({
          msg: "err/User not found",
        });
      }

      const user = result[0];
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.json({
          msg: "err/Invalid password",
        });
      }

      return res.json({
        msg: "success/Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    }
  );
});

module.exports = Router;
