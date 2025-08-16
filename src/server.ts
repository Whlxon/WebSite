import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware pour gérer les données POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../html_pages')));

// Connexion à SQLite
const dbPromise = open({
    filename: '/root/monSite/db/projets_db.sqlite',
    driver: sqlite3.Database,
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html_pages/Eng/index.html'));
})

app.get('/index.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html_pages/Eng/index.html'));
})

app.get('/formulaire.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html_pages/Both/formulaire.html'));
})

app.get('/myProjects.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html_pages/Eng/myProjects.html'));
})

app.get('/viewData.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html_pages/Both/viewData.html'));
})

app.get('/index-fr.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html_pages/Fr/index-fr.html'));
})

app.get('/myProjects-fr.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html_pages/Fr/myProjects-fr.html'));
})

app.get('/funFact.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html_pages/Both/funFact.html'));
})

app.get('/8sXzGy9Y278ttDzD7X', async (req, res) => {
    try {
        const db = await dbPromise;
        const projets = await db.all("SELECT * FROM projets");
        res.json(projets); // Retourne les données au client
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
        res.status(500).send("Erreur serveur");
    }
});

app.post("/save", async (req: Request, res: Response) => {
    const { title, description, email, language } = req.body;

    if (!title) {
        res.status(400).send("Le titre est requis !");
        return;
    }

    try {
        const db = await dbPromise;
        await db.run(
            `INSERT INTO projets (title, description, email, language) VALUES (?, ?, ?, ?)`,
            [title, description, email, language]
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'enregistrement des données.");
    }

    // Configurer le transporteur SMTP
    const transporter = nodemailer.createTransport({
        service: "gmail", // Par exemple Gmail
        auth: {
            user: "cyril.houppertz@gmail.com", // Remplace par ton email
            pass: "rjve yydi whhb ccap", // Mot de passe ou App Password
        },
    });

    // Contenu de l'email
    const mailOptions = {
        from: "cyril.houppertz@gmail.com",
        to: "cyril.houppertz@gmail.com", // Destinataire
        subject: "Nouveau projets !",
        text: `Le titre du projet est:\n${title} \n\nLa description:\n${description}\n\nL'email de la personne:\n${email}\n\nLa langue de communication est:\n${language}`,
    };

    // Contenu de l'email
    const mailToClient = {
        from: "cyril.houppertz@gmail.com",
        to: email, // Destinataire
        subject: "Email sent successfully ! / Email envoyé avec succès !",
        html: `<h1>Fr:</h1>
               <h2>Corp du projet envoyé</h2>
               <br>
               <br>
               <h3><u><strong>Le titre du projet est :</strong></u></h3>
               <div>${title}</div>
               <br>
               <h3><u><strong>Description :</strong></u></h3>
               <div>${description}</div>
               <br>
               <h3><u><strong>Langue de communication : ${language}</strong></u></h3>
               <div> ${language}</div>
               <br>
               <br>
               <br>
               <h1>Eng:</h1>
               <h2>Body of project</h2>
               <br>
               <br>
               <h3><u><strong>project Title :</strong></u></h3>
               <div>${title}</div>
               <br>
               <h3><u><strong>Descriptions :</strong></u></h3>
               <div>${description}</div>
               <br>
               <h3><u><strong>Communication Language : ${language}</strong></u></h3>
               <div> ${language}</div>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailToClient);
        res.sendFile(path.resolve(__dirname, '../html_pages/Both/formulaire.html'));
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        res.status(500).send("Échec de l'envoi de l'email.");
    }
});


//Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
