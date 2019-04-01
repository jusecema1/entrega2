const fs = require('fs');
const pathCursos = `${__dirname}/../files/cursos.json`;
const pathPersonas = `${__dirname}/../files/personas.json`;
const pathPersonaCurso = `${__dirname}/../files/personaCurso.json`;

let listaCursos = null;
let listaPersonas = null;
let listaPersonaCurso = null;

let getListaCursos = () => {
    try {
        if (!listaCursos) {
            try {
                listaCursos = require(pathCursos);
            } catch (error) {
                listaCursos = [];
            }
        }
        return listaCursos;
    } catch (error) {
        return [];
    }
}

let validarCurso = (curso) => {
    if (!curso.id || !curso.nombre || !curso.descripcion || !curso.valor) {
        return false;
    } else {
        return (!buscarCurso(curso.id));
    }
}

let buscarCurso = (idCurso) => {
    return listaCursos.find((c) => {
        return c.id === idCurso;
    });
}

let crearCurso = (curso) => {
    if (validarCurso(curso)) {
        curso.estado = 'disponible';
        listaCursos.push(curso);
        fs.writeFile(pathCursos, JSON.stringify(listaCursos), (err) => {
            if (err) throw err;
        });
        return '<strong>Curso registrado exitosamente</strong>';
    } else {
        return '<strong>El curso con id ' + curso.id + ' ya se encuentra registrado. Actualica la información e intente de nuevo.</strong><br>';
    }
};

let actualizarCurso = (curso) => {
    listaCursos[listaCursos.findIndex(el => el.id === curso.id)] = curso;
    fs.writeFile(pathCursos, JSON.stringify(listaCursos), (err) => {
        if (err) throw err;
    });
    return '<strong>Curso actualizado</strong >'
}

//Inscripciones

let crearPersona = (persona) => {
    if (!listaPersonas.find((p) => { return p.documento === persona.documento })) {
        listaPersonas.push(persona);
        fs.writeFile(pathPersonas, JSON.stringify(listaPersonas), (err) => {
            if (err) throw err;
        });
    }
};
let crearPersonaCurso = (personaCurso) => {
    if (!listaPersonaCurso.find((pc) => { return pc.idCurso === personaCurso.idCurso })) {
        console.log('nuevo');
        listaPersonaCurso.push(personaCurso);
    } else {
        console.log('existe', listaPersonaCurso);
        //let index = listaPersonaCurso.findIndex((pc) => { pc.idCurso === personaCurso.idCurso });
        listaPersonaCurso[listaPersonaCurso.findIndex(el => el.idCurso === personaCurso.idCurso)] = personaCurso;
        console.log('index', listaPersonaCurso);
    }
    fs.writeFile(pathPersonaCurso, JSON.stringify(listaPersonaCurso), (err) => {
        if (err) throw err;
    });
};

let inscribirEnCurso = (idCurso, persona) => {
    let respuesta = 'Inscrpcion exitosa';
    let personaCurso = getListaPersonaCurso().find((pc) => { return pc.idCurso === idCurso });
    if (!personaCurso) {
        personaCurso = {
            'idCurso': idCurso,
            'inscritos': []
        }
        personaCurso.inscritos.push(persona.documento);
        crearPersona(persona);
        crearPersonaCurso(personaCurso);
    } else {
        let doc = personaCurso.inscritos.find((ins) => { return ins === persona.documento });
        if (!doc) {
            personaCurso.inscritos.push(persona.documento);
            crearPersona(persona);
            crearPersonaCurso(personaCurso);
        } else {
            respuesta = 'Ya se encuentra inscrito en este curso';
        }
    }
    return respuesta;
};

let getListaPersonas = () => {
    try {
        if (!listaPersonas) {
            try {
                listaPersonas = require(pathPersonas);
            } catch (error) {
                listaPersonas = [];
            }
        }
        return listaPersonas;
    } catch (error) {
        return [];
    }
}

//PersonaCurso

let getListaPersonaCurso = () => {
    try {
        if (!listaPersonaCurso) {
            try {
                listaPersonaCurso = require(pathPersonaCurso);
            } catch (error) {
                listaPersonaCurso = [];
            }
        }
        return listaPersonaCurso;
    } catch (error) {
        return [];
    }
}

let inscritosPorCurso = (idCurso) => {
    let personaCurso = getListaPersonaCurso().find((pc) => { return pc.idCurso === idCurso });

    if (!personaCurso) {
        return 'No hay inscripciones para este curso';
    } else {
        if (!personaCurso.inscritos) {
            return 'No hay inscripciones para este curso';
        } else {
            let listaInscritos = [];
            personaCurso.inscritos.forEach(ins => {
                listaInscritos.push(listaPersonas.find((p) => { return p.documento === ins }));
            });
            if (!Array.isArray(listaInscritos)) {
                listaInscritos = [listaInscritos];
            }
            let texto = 'Lista de inscritos <br><br> \
            <table class="table table-striped"> \
            <thead class="thead-dark"> \
            <th> Documento </th> \
            <th> Nombre </th>\
            <th> Correo </th>\
            <th> Teléfono </th>\
            </thead>\
            <tbody>';
            listaInscritos.forEach(ins => {
                texto += '<tr>' +
                    '<td>' + ins.documento + '</td>' +
                    '<td>' + ins.nombre + '</td>' +
                    '<td>' + ins.correo + '</td>' +
                    '<td>' + ins.telefono + '</td>' +
                    '</tr>';
            });
            texto += '</tbody></table>';

            return texto;
        }
    }
}

let cancelarInscripcion = (idCurso, idPersona) => {
    let personaCurso = getListaPersonaCurso().find((pc) => { return pc.idCurso === idCurso });
    personaCurso.inscritos = personaCurso.inscritos.filter((i) => { return i !== idPersona });
    crearPersonaCurso(personaCurso);
    return inscritosPorCurso(idCurso);
};

getListaCursos();
getListaPersonas();
getListaPersonaCurso();

module.exports = {
    getListaCursos,
    getListaPersonas,
    getListaPersonaCurso,
    actualizarCurso,
    buscarCurso,
    crearCurso,
    inscribirEnCurso,
    inscritosPorCurso,
    cancelarInscripcion

};