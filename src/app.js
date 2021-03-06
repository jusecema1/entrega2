/** DEPENDENCIAS */
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//### Para usar las variables de sesión
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

const userRoutes = require('./routes/user');

const cursosCtrl = require('./controllers/cursoController');

require('./helpers/helpers');
require('./helpers/cursoHelpers');
require('./helpers/inscripcionHelpers');

/**DIRECTOTIOS */
const directorioPublico = path.join(__dirname, '../public');
const directorioPartials = path.join(__dirname, '../template/partials');
const dirNode_modules = path.join(__dirname, '../node_modules')

/** HBS */
hbs.registerPartials(directorioPartials);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(directorioPublico));

app.set('views', path.join(__dirname, '../template/views'));
app.set('view engine', 'hbs');

/**BOOTSTRAP */
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//### Para usar las variables de sesión
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // let token = localStorage.getItem('token')

    //  jwt.verify(token, 'virtual-tdea', (err, decoded) => {

    //        if (err) {
    //            return next();
    //        }

    //        req.usuario = decoded.usuario;
    //        console.log(req.usuario)
    //        res.locals.sesion = true
    //        res.locals.nombre = req.usuario.nombre
    //        next();

    //    });

    //En caso de usar variables de sesión
    if (req.session.usuario) {
        res.locals.sesion = true
        res.locals.nombre = req.session.nombre
    }
    next()
});



app.use("/users", userRoutes);


app.get('/', (req, res) => {
    res.render('index', {
        site: "SIA-JSCM",
        title: 'Inicio'
    });
});

app.post('/calculos', (req, res) => {
    res.render('calculos', {
        estudiante: req.query.nombre,
        nota1: parseFloat(req.body.nota1),
        nota2: parseFloat(req.body.nota2),
        nota3: parseFloat(req.body.nota3)
    });
});

/** CURSOS */
app.get('/cursos', (req, res) => {
    res.render('cursos/index', {
        title: 'Cursos'
    });
});

app.get('/cursos/crear', (req, res) => {
    res.render('cursos/crear', {
        title: 'Crear curso'
    })
});

app.post('/cursos/crear', (req, res) => {
    let nuevoCurso = {
        id: parseFloat(req.body.id),
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        modalidad: req.body.modalidad,
        intensidad: parseFloat(req.body.intensidad),
        valor: parseFloat(req.body.valor)
    };
    res.render('cursos/crear', {
        title: 'Crear curso',
        curso: nuevoCurso,
        respuesta: cursosCtrl.crearCurso(nuevoCurso)
    });
});

app.get('/cursos/actualizar', (req, res) => {
    res.render('cursos/actualizar', {
        title: 'Actualizar curso'
    })
});

app.post('/cursos/actualizar', (req, res) => {
    let nuevoCurso = cursosCtrl.buscarCurso(parseFloat(req.body.idSelect));
    nuevoCurso.estado = req.body.estado;
    res.render('cursos/actualizar', {
        title: 'Actualizar curso',
        curso: nuevoCurso,
        respuesta: cursosCtrl.actualizarCurso(nuevoCurso)
    });
});

app.get('/inscripcion/cursosDisponibles', (req, res) => {
    res.render('inscripcion/cursosDisponibles', {
        title: 'Cursos disponibles'
    })
});

app.get('/inscripcion/inscribirCurso', (req, res) => {
    res.render('inscripcion/inscribirCurso', {
        title: 'Inscribir curso'
    })
});

app.post('/inscripcion/inscribirCurso', (req, res) => {
    let newPersona = {
        nombre: req.body.nombre,
        documento: req.body.documento,
        correo: req.body.correo,
        telefono: req.body.telefono
    }
    let idCurso = parseFloat(req.body.idCursoSelect);
    res.render('inscripcion/inscribirCurso', {
        title: 'Inscribir curso',
        respuesta: cursosCtrl.inscribirEnCurso(idCurso, newPersona)
    })
});

app.get('/inscripcion/verInscripciones', (req, res) => {
    res.render('inscripcion/verInscripciones', {
        title: 'Consultar inscripciones'
    })
});

app.post('/inscripcion/verInscripciones', (req, res) => {
    let idCurso = parseFloat(req.body.idCursoSelect);
    res.render('inscripcion/verInscripciones', {
        title: 'Consultar inscripciones',
        respuesta: cursosCtrl.inscritosPorCurso(idCurso)
    })
});



app.get('/inscripcion/cancelarInscripcion', (req, res) => {
    res.render('inscripcion/cancelarInscripcion', {
        title: 'Cancelar inscripciones'
    })
});

app.post('/inscripcion/cancelarInscripcion', (req, res) => {
    let idCurso = parseFloat(req.body.idCursoSelect);
    let idPersona = req.body.documento;
    res.render('inscripcion/cancelarInscripcion', {
        title: 'Cancelar inscripciones',
        respuesta: cursosCtrl.cancelarInscripcion(idCurso, idPersona)
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        estudiante: 'error'
    });
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resultado) => {
    if (err) {
        return console.log(error)
    }
    console.log("conectado")
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando por el puerto ' + process.env.PORT);
});

module.exports = [
    app
];