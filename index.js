import express from "express";
import Database from "./Database/database.js";
import chamadoRoute from "./Routes/chamadoRoute.js";
import dialogFlowRoute from "./Routes/dialogFlowRoute.js";
import inicializarDados from "./Database/inicializardb.js";
import session from "express-session"

const db = Database.getInstance();
const app = new express();

inicializarDados().then(() => {
    console.log("✅ Banco de dados inicializado!");
}).catch(error => {
    console.error("❌ Erro ao inicializar banco de dados:", error);
})

app.use(session({
    secret: "Iv3TN0kuM5i6c0g0h5qJBTO85ua5O6we",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: true
    }
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/chamado', chamadoRoute);
app.use('/webhook', dialogFlowRoute);

app.listen(9091, () => {
    console.log("Server started on port 9091");
});
