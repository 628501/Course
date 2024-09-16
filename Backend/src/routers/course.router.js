import { Router } from "express";
import handler from "express-async-handler";
import { connection } from "../server.js";

const router = Router();

router.get(
  "/",
  handler(async (req, res) => {
    try {
      const [rows] = await connection
        .promise()
        .query("SELECT * FROM coursedetail");
      res.json(rows);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Error fetching data" });
    }
  })
);


router.get(
  "/search/:searchTerm",
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    try {
      const [rows] = await connection
        .promise()
        .query(
          "SELECT * FROM coursedetail WHERE name LIKE ? OR instructor LIKE ?",
          [`%${searchTerm}%`, `%${searchTerm}%`]
        );
      res.json(rows);
    } catch (error) {
      console.error("Error searching for courses:", error);
      res.status(500).json({ error: "Error searching for courses" });
    }
  })
);

router.get(
  "/:id",
  handler(async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await connection
        .promise()
        .query("SELECT * FROM coursedetail WHERE id = ?", [id]);
      if (rows.length === 0) {
        res.status(404).json({ error: "Course not found" });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error("Error fetching Course:", error);
      res.status(500).json({ error: "Error fetching Course" });
    }
  })
);

router.post(
  "/enroll",
  handler(async (req, res) => {
    const { name, email, address, phone, course, enrollStatus, courseName } =
      req.body;

    try {
      const query =
        "INSERT INTO enroll (name, email, address, phone, course, enrollStatus, courseName) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        name,
        email,
        address,
        phone,
        JSON.stringify(course),
        enrollStatus,
        courseName,
      ];

      connection.query(query, values, (err) => {
        if (err) {
          console.error("Error Enrolling:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.status(201).json({ message: "Enrolled successfully" });
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  })
);

router.get(
  "/enrolledCourses/:email",
  handler(async (req, res) => {
    const { email } = req.params;
    try {
      const [rows] = await connection
        .promise()
        .query("SELECT * FROM enroll WHERE email = ?", [email]);
      if (rows.length === 0) {
        res.status(404).json({ error: "Enrolled courses not found" });
      } else {
        res.json(rows);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      res.status(500).json({ error: "Error fetching enrolled courses" });
    }
  })
);


router.get('/tag/:tags?', handler(async (req, res) => {
  const { tags } = req.params;

  try {
    let query;
    let queryParams = [];

    if (tags === "All Courses") {
      query = 'SELECT * FROM coursedetail';
    } else {
      query = 'SELECT * FROM coursedetail WHERE category = ?';
      queryParams = [tags];
    }

    const [rows] = await connection.promise().query(query, queryParams);
    res.send(rows);
  } catch (error) {
    console.error('Error searching for tags:', error);
    res.status(500).send({ error: 'Error searching for tags' });
  }
}));

router.post("/enroll/wishlist", async (req, res) => {
  const { email, wishlist, coursename, course } = req.body;


  if (!email || typeof wishlist !== 'boolean' || !coursename || !course) {
    return res.status(400).json({ error: "Missing required fields or invalid data" });
  }

  try {
    if (wishlist) {
      const [existingEntry] = await connection
        .promise()
        .query(
          "SELECT * FROM wishlist WHERE email = ? AND courseName = ?",
          [email, coursename]
        );

      if (existingEntry.length > 0) {
        
        const [updateResult] = await connection
          .promise()
          .query(
            "UPDATE wishlist SET course = ?, wishlist = ? WHERE email = ? AND courseName = ?",
            [JSON.stringify(course), wishlist, email, coursename]
          );

        if (updateResult.affectedRows > 0) {
          return res.json({ message: "Entry updated in wishlist" });
        } else {
          return res.status(400).json({ error: "Failed to update entry" });
        }
      } else {
        const [insertResult] = await connection
          .promise()
          .query(
            "INSERT INTO wishlist (email, courseName, course, wishlist) VALUES (?, ?, ?, ?)",
            [email, coursename, JSON.stringify(course), wishlist]
          );

        if (insertResult.affectedRows > 0) {
          return res.json({ message: "Entry added to wishlist" });
        } else {
          return res.status(400).json({ error: "Failed to add entry" });
        }
      }
    } else {
    
      const [existingEntry] = await connection
        .promise()
        .query(
          "SELECT * FROM wishlist WHERE email = ? AND courseName = ?",
          [email, coursename]
        );

      if (existingEntry.length > 0) {
        const [deleteResult] = await connection
          .promise()
          .query(
            "DELETE FROM wishlist WHERE email = ? AND courseName = ?",
            [email, coursename]
          );

        if (deleteResult.affectedRows > 0) {
          return res.json({ message: "Entry removed from wishlist" });
        } else {
          return res.status(400).json({ error: "Failed to remove entry" });
        }
      } else {
        return res.status(404).json({ error: "Entry not found" });
      }
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/wishlist/:email",
  handler(async (req, res) => {
    const { email } = req.params;

    try {
      const [rows] = await connection
        .promise()
        .query("SELECT * FROM wishlist WHERE email = ?", [email]);
      if (rows.length <= 0 ) {
        res.status(404).json({ error: "courses not found" });
      } else {
        res.json(rows); 
      }
    } catch (error) {
      console.error("Error fetching wishlisted courses:", error);
      res.status(500).json({ error: "Error fetching wishlisted courses" });
    }
  })
);


router.delete('/enroll/delete', async (req, res) => {
  try {
    const ids = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }
    const [result] = await connection.promise().query('DELETE FROM enroll WHERE id IN (?)', [ids]);
    res.status(200).json({ message: `${result.affectedRows} record(s) deleted` });
  } catch (error) {
    console.error('Error deleting records:', error);
    res.status(500).json({ error: 'An error occurred while deleting records' });
  }
});



router.get(
  "/emailValidation/:email/:courseName",
  handler(async (req, res) => {
    const { email, courseName } = req.params;
    try {
      const [rows] = await connection
        .promise()
        .query("SELECT * FROM enroll WHERE email = ? AND courseName = ?", [
          email,
          courseName,
        ]);

      if (rows.length > 0) {
        res.json(true);
      } else {
        res.json(false);
      }
    } catch (error) {
      console.error("Error validating email:", error);
      res.status(500).json({ error: "Error validating email" });
    }
  })
);

router.get('/search/suggestions/:query', handler(async (req, res) => {
  const { query } = req.params;
  try {
    const [courses] = await connection.promise().query(
      "SELECT * FROM coursedetail WHERE name LIKE ? OR instructor LIKE ?",
      [`%${query}%`, `%${query}%`]
    );
    res.json(courses);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Error fetching suggestions" });
  }
}));


export default router;