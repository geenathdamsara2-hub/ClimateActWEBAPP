const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {

    try {

        db.query("SELECT COUNT(*) AS users FROM users", (err1, users) => {

            if (err1) return res.status(500).json(err1);

            db.query("SELECT COUNT(*) AS articles FROM articles", (err2, articles) => {

                if (err2) return res.status(500).json(err2);

                db.query("SELECT COUNT(*) AS feedback FROM feedback", (err3, feedback) => {

                    if (err3) return res.status(500).json(err3);

                    res.json({

                        success: true,

                        users: users[0].users,

                        articles: articles[0].articles,

                        feedback: feedback[0].feedback

                    });

                });

            });

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};