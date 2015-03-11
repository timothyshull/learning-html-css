<?php
try {
  $dbh = new PDO("sqlite:friends.sqlite3", '', '', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''));
  foreach($dbh->query('SELECT * from Friends') as $row) {
    print_r($row);
  }
  $dbh = null;
} catch (PDOException $e) {
  print "Error!: " . $e->getMessage() . "<br/>";
  die();
}

echo '</br>';
$dbh = new PDO("sqlite:friends.sqlite3");

if (!$dbh)
  {
    die('Could not connect: ' . mysql_error());
  }

foreach($dbh->query('SELECT * from Friends') as $row) {
  print_r($row);
}

$name = $_POST['name'];
$gender = $_POST['gender'];

// settype($name, "string");
// settype($gender, "string");
echo '</br>';
print_r($name);
echo ' ';
print_r($gender);
echo '</br>';

$stmt = $dbh->prepare('INSERT INTO \'Friends\' VALUES (\'$name\', \'$gender\')');

// $stmt->bindValue(':name', $name, SQLITE3_TEXT);
// $stmt->bindValue(':gender', $gender, SQLITE3_TEXT);

// $data = array($name, $gender);

// print_r($data);
// echo '</br>';
// print_r($stmt);

// $dbh->beginTransaction();
$stmt->execute();
echo $stmt->execute(); // 1


  // or die($dbh->errorInfo());
// print("<b>" + $count + "</b>");
// $dbh->commit();
// $dbh = null;

// $dbh->exec($stmt);

// execute($stmt2);

// $stmt2 = "SELECT * FROM Friends;";
//
// $dbh->exec($stmt);


// $dbh->exec($stmt);


// $stmt->bindParam(':name', $name);
// $stmt->bindParam(':gender', $gender);


// $stmt->execute();



// if (!empty($name)) {

  // $stmt->execute();

  // $dbhandle = sqlite_open('db/test.db', 0666, $error);
  //
  //    if (!$dbhandle) die ($error);
  //
  //    $stm = "INSERT INTO Friends(Name, Sex) VALUES('$name_es', '$gender')";
  //    $ok = sqlite_exec($dbhandle, $stm, $error);
  //
  //    if (!$ok) die("Error: $error");
  //    echo "Form submitted successfully";
  // }
  ?>
