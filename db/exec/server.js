"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware pour gérer les données POST
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../html_pages')));
// Connexion à SQLite
const dbPromise = (0, sqlite_1.open)({
    filename: '/home/cyreal/Desktop/WebSite_project/db/projets_db.sqlite',
    driver: sqlite3_1.default.Database,
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Eng/index.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Eng/index.html'));
});
app.get('/formulaire.html', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Both/formulaire.html'));
});
app.get('/myProjects.html', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Eng/myProjects.html'));
});
app.get('/viewData.html', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Both/viewData.html'));
});
app.get('/index-fr.html', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Fr/index-fr.html'));
});
app.get('/myProjects-fr.html', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Fr/myProjects-fr.html'));
});
app.get('/funFact.html', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Both/funFact.html'));
});
app.get('/8sXzGy9Y278ttDzD7X', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield dbPromise;
        const projets = yield db.all("SELECT * FROM projets");
        res.json(projets); // Retourne les données au client
    }
    catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
        res.status(500).send("Erreur serveur");
    }
}));
app.post("/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { title, description, email, language } = req.body;
    if (!title) {
        res.status(400).send("Le titre est requis !");
        return;
    }
    try {
        const db = yield dbPromise;
        yield db.run(`INSERT INTO projets (title, description, email, language) VALUES (?, ?, ?, ?)`, [title, description, email, language]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'enregistrement des données.");
    }
    // Configurer le transporteur SMTP
    const transporter = nodemailer_1.default.createTransport({
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
    try {
        yield transporter.sendMail(mailOptions);
        res.sendFile(path_1.default.resolve(__dirname, '../html_pages/Both/confirmation.html'));
    }
    catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        res.status(500).send("Échec de l'envoi de l'email.");
    }
}));
//Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
