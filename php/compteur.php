<?php
$filename = "./visites.txt";

// Si le fichier existe, on lit le compteur
if (file_exists($filename)) {
    $visits = (int) file_get_contents($filename);
} else {
    $visits = 0;
}

// On incrémente
$visits++;

// On sauvegarde le nouveau total
file_put_contents($filename, $visits);

// On renvoie le nombre
echo $visits;
?>