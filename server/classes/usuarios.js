
class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        }

        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(item => {
            return item.id == id
        })[0];

        return persona;
    }

    getPeronas() {
        return this.personas;
    }

    getPersonasSalas(sala) {
        return this.personas.filter(item => { return item.sala === sala });
    }

    borrarPeronas(id) {

        let persona = this.getPersona(id);

        this.personas = this.personas.filter(item => { return item.id != id });

        return persona;
    }
}

module.exports = {
    Usuarios
}