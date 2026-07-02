const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      location,
      bio
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {

        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already registered"
          });
        }

        const hashedPassword =
          await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO users
          (name,email,password,location,bio)
          VALUES (?,?,?,?,?)`,
          [
            name,
            email,
            hashedPassword,
            location,
            bio
          ],
          (err, result) => {

            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message
              });
            }

            res.status(201).json({
              success: true,
              message: "User registered successfully"
            });

          }
        );

      }
    );

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
exports.login = (req, res) => {


    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }
    

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            const validPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        }
    );

};
exports.updateProfile = (req, res) => {

    const { id } = req.params;

    const {
        name,
        location,
        bio
    } = req.body;

    db.query(
        `UPDATE users
         SET name=?, location=?, bio=?
         WHERE id=?`,
        [
            name,
            location,
            bio,
            id
        ],
        (err) => {

            if(err){

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({

                success:true,

                message:"Profile updated successfully"

            });

        }
    );

};