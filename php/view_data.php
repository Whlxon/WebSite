<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projets_db";

// Connexion à la base
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifie la connexion
if ($conn->connect_error) {
    die("Échec de la connexion : " . $conn->connect_error);
}

// Récupération des données
$sql = "SELECT * FROM projets";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des projets</title>
</head>
<body>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Email</th>
            <th>Langue</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['title']}</td>
                    <td>{$row['description']}</td>
                    <td>{$row['email']}</td>
                    <td>{$row['language']}</td>
                </tr>";
            }
        } else {
            echo "<tr><td colspan='5'>Aucun projet trouvé</td></tr>";
        }
        ?>
    </table>
</body>
</html>

<?php $conn->close(); ?>
