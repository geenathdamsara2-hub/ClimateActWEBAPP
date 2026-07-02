const db = require("../config/db");

exports.submitFeedback = (req, res) => {

    const {
        name,
        email,
        subject,
        rating,
        message
    } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields"
        });
    }

    db.query(
        `INSERT INTO feedback
        (name,email,subject,rating,message)
        VALUES (?,?,?,?,?)`,
        [
            name,
            email,
            subject,
            rating,
            message
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Feedback submitted successfully"
            });

        }
    );

};

exports.getAllFeedback = (req, res) => {

    db.query(
        "SELECT * FROM feedback ORDER BY created_at DESC",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                feedback: results
            });

        }
    );

};