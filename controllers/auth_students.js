const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
});

exports.addStudent = (req, res) => {
  const { first_name, last_name, email, course_id } = req.body;
  db.query(
    `SELECT email FROM students WHERE email = ?`,
    email,
    function (err, result) {
      console.log(result);
      if (err) throw err;
      else {
        if (result.length > 0) {
          return res.render("enroll", {
            message: "Email is already existing",
          });
        } else {
          db.query(
            "INSERT INTO students set ?",
            {
              first_name: first_name,
              last_name: last_name,
              email: email,
              course_id: course_id,
            },
            function (err, result) {
              if (err) throw err;
              else {
                return res.render("enroll", {
                  message: "Enrolled Successfully",
                });
              }
            }
          );
        }
      }
    }
  );
};

exports.loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("index", {
        message: "Fill-out empty fields",
      });
    } else {
      db.query(
        "SELECT * FROM admins WHERE email=?",
        email,
        async function (err, result) {
          if (!result) {
            console.log(result);
            return res.render("index", {
              message: "Email  is incorrect",
            });
          } else if (result[0].password != password)
            return res.render("index", {
              message: "Password  is incorrect",
            });
          else {
            const id = result[0].admin_id;
            const token = jwt.sign(id, process.env.JWT_SECRET);
            const cookieOption = {
              expires:
                new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES) *
                24 *
                60 *
                1000,
              httpOnly: true,
            };
            res.cookie("cookie_access_token", token, cookieOption);
            console.log("token: " + token);

            db.query(
              "SELECT students.student_id, students.first_name,students.last_name, students.email , courses.course_name FROM students INNER JOIN courses ON students.course_id = courses.course_id;",
              (err, result) => {
                if (!result) {
                  return res.render("enrolledStudents", {
                    message: "No results found",
                  });
                } else {
                  //   console.log(result);
                  res.render("enrolledStudents", {
                    title: "List of Users",
                    data: result,
                  });
                }
              }
            );
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

exports.updateform = (req, res) => {
  const email = req.params.email;
  db.query(`SELECT * FROM students WHERE email = "${email}"`, (err, result) => {
    console.log(result);
    res.render("updateform", {
      title: "Update User Account",
      user: result[0],
    });
  });
};

exports.updateUser = (req, res) => {
  const { first_name, last_name, email, course_id } = req.body;
  db.query(
    `UPDATE students SET first_name = '${first_name}', last_name= '${last_name}', course_id='${course_id}' WHERE email = '${email}'`,
    (err) => {
      db.query(
        `SELECT students.student_id, students.first_name,students.last_name, students.email , courses.course_name FROM students INNER JOIN courses ON students.course_id = courses.course_id`,
        (err, result) => {
          res.render("enrolledStudents", {
            title: "Update User Account",
            data: result,
          });
        }
      );
    }
  );
};

exports.deleteUser = (req, res) => {
  const email = req.params.email;
  db.query(`DELETE FROM students WHERE email = "${email}"`, (err) => {
    if (err) throw err;
    else {
      console.log("user deleted");
      db.query(
        `SELECT students.student_id, students.first_name,students.last_name, students.email , courses.course_name FROM students INNER JOIN courses ON students.course_id = courses.course_id`,
        (err, result) => {
          res.render("enrolledStudents", {
            title: "Update User Account",
            data: result,
          });
        }
      );
    }
  });
};
exports.return = (req, res) => {
  db.query(
    "SELECT students.student_id, students.first_name,students.last_name, students.email , courses.course_name FROM students INNER JOIN courses ON students.course_id = courses.course_id;",
    (err, result) => {
      if (!result) {
        return res.render("enrolledStudents", {
          message: "No results found",
        });
      } else {
        //   console.log(result);
        res.render("enrolledStudents", {
          title: "List of Users",
          data: result,
        });
      }
    }
  );
};

exports.logoutAccount = (req, res) => {
  res.clearCookie("cookie_access_token");
  res.render("index");
};
