export default class User {
    constructor(name, email, password) {
        this.name = name,
        this.email = email,
        this.password = password
    }

    toString(){
    	return "Nom : " + this.name + "Email: " + this.email + "password: "+ this.password;
    }
}