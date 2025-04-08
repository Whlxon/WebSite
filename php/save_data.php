<?php
$servername = "localhost"; // Change si nécessaire
$username = "root"; // Ton nom d'utilisateur
$password = ""; // Ton mot de passe
$dbname = "projets_db"; // Nom de la base de données

// Connexion à la base
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifie la connexion
if ($conn->connect_error) {
    die("Échec de la connexion : " . $conn->connect_error);
}

// Requête pour insérer les données
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $titre = $_POST['title'];
    $description = $_POST['description'];
    $email = $_POST['email'];
    $langue = $_POST['language'];

    $sql = "INSERT INTO projets (title, description, email, language) VALUES ('$titre', '$description', '$email', '$langue')";

    if ($conn->query($sql) === TRUE) {
        echo "Données enregistrées avec succès !";
    } else {
        echo "Erreur : " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
