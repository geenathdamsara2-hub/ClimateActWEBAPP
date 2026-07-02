const db = require("../config/db");

exports.getAllArticles = (req, res) => {

    db.query(
        "SELECT * FROM articles ORDER BY created_at DESC",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                articles: results
            });

        }
    );

};
exports.createArticle = (req, res) => {

    const {
        title,
        category,
        content,
        image,
        author
    } = req.body;

    if (!title || !category || !content) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields"
        });
    }

    db.query(
        `INSERT INTO articles
        (title,category,content,image,author)
        VALUES (?,?,?,?,?)`,
        [
            title,
            category,
            content,
            image,
            author
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
                message: "Article created successfully"
            });

        }
    );

};
exports.updateArticle = (req, res) => {

    const { id } = req.params;

    const {
        title,
        category,
        content,
        image,
        author
    } = req.body;

    db.query(
        `UPDATE articles
         SET title=?,
             category=?,
             content=?,
             image=?,
             author=?
         WHERE id=?`,
        [
            title,
            category,
            content,
            image,
            author,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Article updated successfully"
            });

        }
    );

};
exports.deleteArticle = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM articles WHERE id=?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Article deleted successfully"
            });

        }
    );

};