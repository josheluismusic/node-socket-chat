const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utils/utilidades')
const usuario = new Usuarios();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (data, cb) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario'
            });
        }

        console.log(data);

        client.join(data.sala)

        usuario.agregarPersona(client.id, data.nombre, data.sala)
        let personasSalas = usuario.getPersonasSalas(data.sala);
        //console.log(personas);

        client.broadcast.to(data.sala).emit('listarPersonas', personasSalas);


        cb(personasSalas);

    })

    client.on('disconnect', () => {
        let persona = usuario.borrarPeronas(client.id);
        console.log(persona);

        if (persona) {
            client.broadcast.to(persona.sala).emit('crearMensaje', crearMensaje('Administrador', `${persona.nombre} salió`));
            client.broadcast.to(persona.sala).emit('listarPersonas', usuario.getPersonasSalas(persona.sala));
        }
    })

    client.on('crearMensaje', (data) => {
        let persona = usuario.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        console.log(mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    //mensaje privados
    client.on('mensajePrivado', (data) => {
        let persona = usuario.borrarPeronas(client.id);

        client.broadcast.to(data.to).emit('crearMensaje', crearMensaje(persona.nombre, data.mensaje));
    });

});