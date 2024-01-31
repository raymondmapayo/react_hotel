const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const upload = multer({ dest: 'images' });



const axios = require('axios');
const { error } = require('console');
const http = require("http");
const { Server } = require("socket.io");

const PORT = 8081;
const stripe = require("stripe")("sk_test_51OMn56GZE3WoC30I8KribrKWhYmaaDWfzJfIS9d4WpzaK7m9VMAxt1C5LxwHf1RJij00bRuEOeTq3A7cENZjASW6007eRNgESv");
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "react_hotel"
});
//----------------------------USERLIST-----------------------------------//
app.get('/user', (request, response)=>{
    const sql = "SELECT * FROM user";
    db.query(sql,(error, data)=>{
        if(error) return response.json(error);
        return response.json(data)
    });
});


app.post('/add_user', (request, response)=>{
    const {name, email, password, gender,status,phone} = request.body;
    const sql = 'INSERT INTO user (name, email, password, gender, status, phone) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql,[name,email,password, gender, status, phone], (error, result)=>{
        if(error) throw error;
        response.send('User added');
    });
});

app.delete('/user/:id', (request, response)=>{
    const id = request.params.id;
    const sql = 'DELETE FROM user WHERE id = ?';
    db.query(sql,[id], (error, result)=>{
        if(error) throw error;
        response.send('User deleted');
        
    });
});

app.get('/user/:id', (request, response)=>{
    const id = request.params.id;
    console.log("id:" + id);
    const sql = 'SELECT * FROM user WHERE id=?';
    db.query(sql, [id], (error, data)=>{
        if(error) return response.json(error);
        return response.json(data)
    });
});

app.put('/user/:id', (request, response) => {
    const id = request.params.id;
    const { name, email, gender, status,phone } = request.body;
    const sql = 'UPDATE user SET name = ?, email = ?, gender = ?, status = ?, phone = ? WHERE id = ?';
    db.query(sql, [name, email, gender, status,phone, id], (error, result) => {
        if (error) throw error;
        response.send('User Updated');
    });
});


app.post('/add_register', (request, response) => {
    const { name, email, password, gender, status, phone } = request.body;
    const sql = 'INSERT INTO user (name, email, password, gender, status, phone) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [name, email, password, gender, status, phone], (error, result) => {
        if (error) {
            console.error("Error adding user:", error);
            response.status(500).json({ error: "Internal Server Error" }); // Send an error response
        } else {
            console.log("User added successfully");
            response.status(200).json({ message: "User added successfully" }); // Send a success response
        }
    });
});
app.post('/user', (request, response) => {
    const { email, password } = request.body;
    const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (error, data) => {
        if (error) return response.json(error);

        if (data.length > 0) {
            return response.json({ success: true, message: 'Login successful' });
        } else {
            return response.json({ success: false, message: 'Invalid login credentials' });
        }
    });
});

//----------------------------END OF USERLIST-----------------------------------//

//---------------------------------ROOMS--------------------------------------//
app.post('/add_rooms', upload.single('room_img'), (request, response) => {
    const { room_name, room_prize, room_type } = request.body;
    const room_img = request.file ? request.file.filename : null;

    const sql = 'INSERT INTO rooms (room_name, room_prize, room_type, room_img, room_status) VALUES (?, ?, ?, ?, "Free")';
    db.query(sql, [room_name, room_prize, room_type, room_img], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        response.send('Room added');
    });
});

app.get('/rooms/:id', (request, response)=>{
    const id = request.params.id;
    console.log("id:" + id);
    const sql = 'SELECT * FROM rooms WHERE id=?';
    db.query(sql, [id], (error, data)=>{
        if(error) return response.json(error);
        return response.json(data)
    });
});



app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/rooms', (request, response) => {
    const sql = "SELECT * FROM rooms";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data)
    });
});

app.delete('/rooms/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'DELETE FROM rooms WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        response.send('Room deleted');
    });
});

app.get('/rooms/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'SELECT * FROM rooms WHERE id=?';
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data)
    });
});
//--------------------------GE USAB NAKO ANG EDIT ROOMS WITH IMAGE-----------------------
app.put('/rooms/:id', upload.single('room_img'), async (request, response) => {
    const id = request.params.id;
    const { room_name, room_prize, room_type, room_status } = request.body;
    let room_img = null;

    if (request.file) {
        // New image provided, use the uploaded image
        room_img = request.file.filename;
    } else {
        // No new image provided, fetch the existing image from the server
        try {
            const existingImageData = await new Promise((resolve, reject) => {
                const sql = 'SELECT room_img FROM rooms WHERE id = ?';
                db.query(sql, [id], (error, result) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(result[0].room_img);
                    }
                });
            });

            room_img = existingImageData;
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    const sql = 'UPDATE rooms SET room_name = ?, room_prize = ?, room_type = ?, room_img = ?, room_status = ? WHERE id = ?';
    db.query(sql, [room_name, room_prize, room_type, room_img, room_status, id], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        response.send('Room Updated');
    });
});

//--------------------------END EDIT---------------------------------
//---------------------------------END ROOMS--------------------------------------//
//----------------------------------USER SIDE-------------------------------------//
app.get('/add_serve/:id', (req, res) => {
    const sql = 'SELECT * FROM rooms WHERE status = "Available"';
    db.query(sql, (error, data) => {
        if (error) return res.status(500).json({ error: 'Internal Server Error' });
        return res.json(data);
    });
});


app.post('/room_serve/:id', upload.single('room_img'), async (req, res) => {
    const roomId = req.params.id;
    const { checkin_date, checkout_date } = req.body;
    const room_img = req.file ? req.file.filename : null;
    const userEmail = req.body.userEmail; // Ensure userEmail is obtained from the request

    try {
        // Insert into room_serve
        const insertReservationQuery = `
            INSERT INTO room_serve (room_id, room_name, email, room_type, checkin_date, checkout_date, room_img, room_prize, room_status)
            SELECT
                ? AS room_id,
                room_name,
                ? AS email,
                room_type,
                ? AS checkin_date,
                ? AS checkout_date,
                rooms.room_img,
                rooms.room_prize * DATEDIFF(?, ?) AS room_prize,
                'Reserved' AS room_status
            FROM rooms
            WHERE id = ?;
        `;

        // Update room status to Reserved
        const updateRoomQuery = `
            UPDATE rooms
            SET room_status = "Reserved"
            WHERE id = ?;
        `;

        // Select room_prize from the inserted room_serve
        const selectRoomServePrizeQuery = 'SELECT room_prize FROM room_serve WHERE room_id = ?';

        db.query(
            insertReservationQuery,
            [roomId, userEmail, checkin_date, checkout_date, checkout_date, checkin_date, roomId],
            (insertError, insertResult) => {
                if (insertError) {
                    console.error("Error inserting reservation:", insertError);
                    res.status(500).send('Error adding reservation. Please try again.');
                    return;
                }

                db.query(updateRoomQuery, [roomId], (updateError, updateResult) => {
                    if (updateError) {
                        console.error("Error updating room status:", updateError);
                        res.status(500).send('Error updating room status. Please try again.');
                        return;
                    }

                    // Select room_prize from the inserted room_serve
                    db.query(selectRoomServePrizeQuery, [roomId], (selectError, selectResult) => {
                        if (selectError) {
                            console.error("Error selecting room_serve room_prize:", selectError);
                            res.status(500).send('Error selecting room_serve room_prize. Please try again.');
                            return;
                        }

                        const roomServePrize = selectResult[0].room_prize;

                        res.status(200).json({ message: 'Successfully Added.', roomServePrize });
                    });
                });
            }
        );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user_serve', (req, res) => {
    const { userEmail } = req.query;

    console.log('User Email:', userEmail);

    const sql = `
        SELECT 
            rs.id,
            rs.room_id, 
            r.room_img, 
            rs.email, 
            rs.room_name, 
            rs.room_type,
            rs.checkin_date, 
            rs.checkout_date, 
            rs.room_prize,
            rs.room_status 
        FROM 
            room_serve rs
        INNER JOIN 
            rooms r ON rs.room_id = r.id
        WHERE 
            rs.email = ?;
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Query Result:', data);
        return res.json(data);
    });
});

app.delete('/roomserve/:room_id', (request, response) => {
    const id = request.params.room_id;
    const deleteRoomServeSql = 'DELETE FROM room_serve WHERE room_id = ?';
    const deleteServeSql = 'DELETE FROM room_confirm WHERE room_id = ?';
    const updateRoomStatusSql = 'UPDATE rooms SET room_status = "Free" WHERE id = ?';

    // Start a database transaction
    db.beginTransaction((error) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Transaction started');

        // Step 1: Delete the room_serve record
        db.query(deleteRoomServeSql, [id], (deleteError, deleteResult) => {
            if (deleteError) {
                console.error('Error deleting room_serve record:', deleteError);
                return db.rollback(() => {
                    response.status(500).json({ error: 'Error deleting room_serve record' });
                });
            }

            console.log('Delete room_serve result:', deleteResult);

            // Step 2: Delete records from the room_confirm table
            db.query(deleteServeSql, [id], (deleteServeError, deleteServeResult) => {
                if (deleteServeError) {
                    console.error('Error deleting room_confirm records:', deleteServeError);
                    return db.rollback(() => {
                        response.status(500).json({ error: 'Error deleting room_confirm records' });
                    });
                }

                console.log('Delete room_confirm result:', deleteServeResult);

                // Step 3: Update the room status to "Free"
                db.query(updateRoomStatusSql, [id], (updateError, updateResult) => {
                    if (updateError) {
                        console.error('Error updating room status:', updateError);
                        return db.rollback(() => {
                            response.status(500).json({ error: 'Error updating room status' });
                        });
                    }

                    console.log('Update room status result:', updateResult);

                    // Commit the transaction
                    db.commit((commitError) => {
                        if (commitError) {
                            console.error('Error committing transaction:', commitError);
                            return db.rollback(() => {
                                response.status(500).json({ error: 'Error committing transaction' });
                            });
                        }

                        console.log('Transaction committed successfully');
                        response.send('Room deleted, and room_serve record and room_confirm records deleted. Room status updated to "Free"');
                    });
                });
            });
        });
    });
});

app.get('/rooms_serve/:id', (request, response) => {
    const id = request.params.id;
    console.log("id:" + id);
    
    // Adjust the SQL query to match your actual table and column names
    const sql = 'SELECT * FROM room_serve WHERE room_id=?';

    db.query(sql, [id], (error, data) => {
        if (error) {
            console.error("Error fetching room_serve data:", error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }

        return response.json(data);
    });
});




app.post('/room_confirm/:id', upload.single('room_img'), async (req, res) => {
    const roomId = req.params.id;
    const { checkin_date, checkout_date, userEmail } = req.body;
    const room_img = req.file ? req.file.filename : null;

    try {
        // Insert into room_confirm using parameterized query
        const insertConfirmationQuery = `
            INSERT INTO room_confirm (room_id, room_name, email, room_type, checkin_date, checkout_date, room_img, room_prize, room_status)
            SELECT
                ? AS room_id,
                room_name,
                ? AS email,
                room_type,
                ? AS checkin_date,
                ? AS checkout_date,
                rooms.room_img,
                room_prize * DATEDIFF(?, ?) AS room_prize,
                'Confirm' AS room_status
            FROM rooms
            WHERE id = ?;
        `;

        // Update room status to Reserved using parameterized query
        const updateRoomQuery = 'UPDATE rooms SET room_status = "Confirm" WHERE id = ?;';

        // Execute the insert confirmation query
        db.query(
            insertConfirmationQuery,
            [roomId, userEmail, checkin_date, checkout_date, checkout_date, checkin_date, roomId],
            (insertError, insertResult) => {
                if (insertError) {
                    console.error("Error inserting confirmation:", insertError);
                    return res.status(500).json({ error: 'Error adding confirmation. Please try again.' });
                }

                // Execute the update room status query
                db.query(updateRoomQuery, [roomId], (updateError, updateResult) => {
                    if (updateError) {
                        console.error("Error updating room status:", updateError);
                        return res.status(500).json({ error: 'Error updating room status. Please try again.' });
                    }

                    return res.status(200).json({ message: 'Successfully Confirmed.' });
                });
            }
        );
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/user_confirm', (req, res) => {
    const { userEmail } = req.query;

    console.log('User Email:', userEmail);

    const sql = `
        SELECT 
            rs.id,
            rs.room_id, 
            r.room_img, 
            rs.email, 
            rs.room_name, 
            rs.room_type,
            rs.checkin_date, 
            rs.checkout_date, 
            rs.room_prize,
            rs.room_status 
        FROM 
            room_confirm rs
        INNER JOIN 
            rooms r ON rs.room_id = r.id
        WHERE 
            rs.email = ?;
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Query Result:', data);
        return res.json(data);
    });
});

app.post('/checkout/:id', async (req, res) => {
  const roomId = req.params.id;
  const { userEmail } = req.query;

  try {
    // Start a database transaction
    await beginTransaction();

    const insertCheckoutQuery = `
INSERT INTO user_payment (
  room_id,
  user_id,
  date_checkin,
  date_checkout,
  total_price,
  payment_status
) VALUES (
  (SELECT ID FROM rooms WHERE id = ? LIMIT 1),
  COALESCE((SELECT ID FROM user WHERE email = ? LIMIT 1), -1),
  (SELECT checkin_date FROM room_confirm WHERE room_id = ? LIMIT 1),
  (SELECT checkout_date FROM room_confirm WHERE room_id = ? LIMIT 1),
  (SELECT room_prize FROM room_confirm WHERE room_id = ? LIMIT 1),
  'pending'
);

    `;

    const updateRoomStatusQuery = 'UPDATE rooms SET room_status = "Available" WHERE id = ?';
    const deleteReservationQuery = 'DELETE FROM room_confirm WHERE room_id = ?';
    const deleteReservetionQuery = 'DELETE FROM room_serve WHERE room_id = ?';

    console.log('Insert Checkout Query:', insertCheckoutQuery);
    await executeQuery(insertCheckoutQuery, [roomId, userEmail, roomId, roomId, roomId]);

    console.log('Update Room Status Query:', updateRoomStatusQuery);
    const updateResult = await executeQuery(updateRoomStatusQuery, [roomId]);

    if (updateResult.affectedRows === 0) {
      throw new Error('Failed to update room status');
    }

    console.log('Delete Reservation Query:', deleteReservationQuery);
    const deleteResult = await executeQuery(deleteReservationQuery, [roomId]);

    if (deleteResult.affectedRows === 0) {
      throw new Error('Failed to delete reservation');
    }
     console.log('Delete Reservation Query:', deleteReservetionQuery);
    const deleteResults = await executeQuery(deleteReservetionQuery, [roomId]);

    if (deleteResults.affectedRows === 0) {
      throw new Error('Failed to delete reserve');
    }

    // Commit the database transaction if all queries are successful
    await commitTransaction();

    res.status(200).json({ message: 'Room checked out successfully' });
  } catch (error) {
    console.error('Error checking out room:', error);

    // Rollback the database transaction if an error occurs
    await rollbackTransaction();

    res.status(500).json({ error: 'Internal Server Error' });
  }
});


async function beginTransaction() {
    return new Promise((resolve, reject) => {
        db.beginTransaction((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function executeQuery(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}


async function commitTransaction() {
    return new Promise((resolve, reject) => {
        db.commit((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function rollbackTransaction() {
    return new Promise((resolve, reject) => {
        db.rollback(() => {
            resolve();
        });
    });
}



app.get('/roomcheckout/:id', (req, res) => {
  const roomId = req.params.id;

  const sql = `
      SELECT 
          rs.id,
          rs.room_id, 
          r.room_img, 
          rs.email, 
          rs.room_name, 
          rs.room_type,
          rs.checkin_date, 
          rs.checkout_date, 
          rs.room_prize,
          rs.room_status 
      FROM 
          room_confirm rs
      INNER JOIN 
          rooms r ON rs.room_id = r.id
      WHERE 
          rs.room_id = ?;
  `;

  db.query(sql, [roomId], (error, data) => {
      if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', data);
      return res.json(data);
      
  });
});

app.get('/pay_history', (req, res) => {
    const { userEmail } = req.query;

    console.log('User Email:', userEmail);

    const sql = `
    SELECT 
        rs.room_id, 
        r.room_img, 
        u.name AS user_name,
        rs.user_id, 
        r.room_name,  -- Change to r.room_name
        r.room_type,
        rs.date_checkin, 
        rs.date_checkout, 
        rs.total_price,
        rs.payment_status 
    FROM 
        user_payment rs
    JOIN 
        user u ON rs.user_id = u.id
    JOIN 
        rooms r ON rs.room_id = r.id
    WHERE 
        u.email = ?;
`;


    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Query Result:', data);
        return res.json(data);
    });
});

app.get('/client_history', (request, response) => {
    const sql = "SELECT * FROM user_payment";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});


app.put('/update_payment_status', (req, res) => {
    const { room_id, new_status } = req.body;

    const updateSql = 'UPDATE user_payment SET payment_status = ? WHERE room_id = ?';

    db.query(updateSql, ['paid', room_id], (error, result) => {
        if (error) {
            console.error('Error updating payment status:', error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: 'Payment status updated successfully' });
        } else {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }
    });
});
app.post('/admin/login', (request, response) => {
  const { email, password } = request.body;
  
  // Adjust the SQL query based on your admin table structure
  const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (error, data) => {
    if (error) {
      console.error('Error fetching admin data:', error);
      return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    if (data.length > 0) {
      // Admin login successful
      return response.json({ success: true, adminData: data[0] });
    } else {
      // Admin login failed
      return response.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }
  });
});

// Define a route to get admin details by ID
app.get('/admin/:id', (request, response) => {
  const id = request.params.id;
  console.log('id:' + id);

  // Adjust the SQL query to match your actual table and column names
  const sql = 'SELECT * FROM admin WHERE id=?';

  db.query(sql, [id], (error, data) => {
    if (error) {
      console.error('Error fetching admin data:', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }

    return response.json(data);
  });
});
app.get('/total_rooms', (request, response) => {
  const sql = 'SELECT COUNT(*) as total_rooms FROM rooms'; // Use COUNT to get the total number directly

  db.query(sql, (error, data) => {
    if (error) {
      console.error('Error fetching room data:', error);
      return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    if (data.length > 0) {
      // Use data[0].total_rooms to access the count
      return response.json({ success: true, total_rooms: data[0].total_rooms });
    } else {
      return response.status(404).json({ success: false, message: 'No rooms found.' });
    }
  });
});
app.get('/total_customer', (request, response) => {
  const sql = 'SELECT COUNT(*) as total_customer FROM user';

  db.query(sql, (error, data) => {
    if (error) {
      console.error('Error fetching user data:', error);
      return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    if (data.length > 0) {
      return response.json({ success: true, total_customer: data[0].total_customer });
    } else {
      return response.status(404).json({ success: false, message: 'No user found.' });
    }
  });
});
app.get('/total_serve', (request, response) => {
  const sql = 'SELECT COUNT(*) as total_serve FROM room_serve';

  db.query(sql, (error, data) => {
    if (error) {
      console.error('Error fetching serve data:', error);
      return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    if (data.length > 0) {
      return response.json({ success: true, total_serve: data[0].total_serve });
    } else {
      return response.status(404).json({ success: false, message: 'No serve found.' });
    }
  });
});
app.get('/total_confirm', (request, response) => {
  const sql = 'SELECT COUNT(*) as total_confirm FROM room_confirm';

  db.query(sql, (error, data) => {
    if (error) {
      console.error('Error fetching confirm data:', error);
      return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    if (data.length > 0) {
      return response.json({ success: true, total_confirm: data[0].total_confirm });
    } else {
      return response.status(404).json({ success: false, message: 'No confirm found.' });
    }
  });
});
app.get('/total_income', (request, response) => {
  const sql = 'SELECT SUM(total_price) as total_income FROM user_payment';

  db.query(sql, (error, data) => {
    if (error) {
      console.error('Error fetching income data:', error);
      return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    if (data.length > 0 && data[0].total_income !== null) {
      return response.json({ success: true, total_income: data[0].total_income });
    } else {
      return response.status(404).json({ success: false, message: 'No income found.' });
    }
  });
});
// Express route for fetching monthly income
app.get('/fetchMonthlyIncome', (req, res) => {
  const sql = 'SELECT DATE_FORMAT(date_checkin, "%Y-%m") AS month, SUM(total_price) AS income FROM user_payment GROUP BY month;';

  db.query(sql, (error, data) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
    }

    if (data.length > 0) {
      // If there are multiple entries for different months, return all data
      return res.json({ success: true, monthlyIncomeData: data });
    } else {
      return res.status(404).json({ success: false, message: 'No income found.' });
    }
  });
});


//----------------------SOCKET IO-------------------------------//
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle joining a room
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);

        // Retrieve previous messages for the room and send them to the client
        const query = "SELECT * FROM messages WHERE room = ? ORDER BY id";
        db.query(query, [data], (err, results) => {
            if (err) {
                console.error("Error retrieving messages from database:", err);
            } else {
                const messages = results.map((row) => ({
                    room: row.room,
                    author: row.author,
                    message: row.message,
                    time: row.time,
                }));
                socket.emit("receive_messages", messages);
            }
        });
    });

    // Handle sending a message
    socket.on("send_message", (data) => {
        const { room, author, message, time } = data;

        // Save the message to MySQL database
        const query = "INSERT INTO messages (room, author, message, time) VALUES (?, ?, ?, ?)";
        db.query(query, [room, author, message, time], (err) => {
            if (err) {
                console.error("Error saving message to database:", err);
            } else {
                console.log("Message saved to database");

                // Broadcast the message to other clients
                socket.to(room).emit("receive_message", data);
            }
        });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});
app.get('/authuser', (req, res) => {
    const { userEmail } = req.query;
    const sql = `
        SELECT id FROM user WHERE email = ?
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Query Result:', data); // Add this line
        return res.json(data);
    });
});

app.get('/authusername', (req, res) => {
    const { userEmail } = req.query;
    const sql = `
        SELECT name FROM user WHERE email = ?
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Query Result:', data); // Add this line
        return res.json(data);
    });
});

//----------------------------------END OF USER SIDE -----------------------------//


app.get('/', (request, response)=> {
    return response.json("The server started.");

});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



server.listen(3001, () => {
    console.log("SERVER RUNNING");
});
//------------------API----------------//
const successUrl = "http://localhost:5173/reserve";
const cancelUrl = "http://localhost:3000/cancel.html";

app.post("/create-checkout-session", async (req, res) => {
    try {
        const { totalprice, items } = req.body;
         room_id = req.body.room_id;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: items.map(item => {
                return {
                    price_data: {
                        currency: "php",
                        product_data: {
                            name: "Product Name", // Replace with your product name
                        },
                        unit_amount: totalprice * 100, // Convert totprice to cents if needed
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



app.listen(3000);