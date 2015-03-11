<?php
 
// Set default timezone
date_default_timezone_set('UTC');
 
// try {
	/**************************************
	* Create databases and                *
	* open connections                    *
	**************************************/
 
	// Create (connect to) SQLite database in file
	$file_db = new PDO('sqlite:friends.sqlite3');
	// Set errormode to exceptions
	$file_db->setAttribute(PDO::ATTR_ERRMODE, 
	PDO::ERRMODE_EXCEPTION);
 
	/**************************************
	* Create tables                       *
	**************************************/
	
	// $idQuery = $file_db->prepare("SELECT last_insert_rowid()");
	//
	// $id = $idQuery->execute();
	// // $id = $id + 1;
	$name = $_POST['name'];
	$gender = $_POST['gender'];
	
	// Create table messages
	// $file_db->exec("CREATE TABLE IF NOT EXISTS Friends (id INTEGER PRIMARY KEY, name TEXT, gender TEXT)");
	
	/**************************************
	* Play with databases and tables      *
	**************************************/
 
	// Prepare INSERT statement to SQLite3 file db
	$insert = "INSERT INTO Friends (name, gender) 
		VALUES (:name, :gender)";
	
	$stmt = $file_db->prepare($insert);
	
	// Bind parameters to statement variables
	// $stmt->bindParam(':id', $id);
	$stmt->bindParam(':name', $name);
	$stmt->bindParam(':gender', $gender);
	
	// Execute statement
	$stmt->execute();
 
	/**************************************
	* Drop tables                         *
	**************************************/
 
	// Drop table messages from file db
	// $file_db->exec("DROP TABLE Friends");
 
	/**************************************
	* Close db connections                *
	**************************************/
 
	// Close file db connection
	$file_db = null;
// }

// catch(PDOException $e) {
// 	// Print PDOException message
// 	echo $e->getMessage();
// }

header("location: http://localhost:3000");
// header("location: file://index.html");
  
?>
