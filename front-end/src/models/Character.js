export default class Character{
	constructor(name,gender,job,characteristics,username){
    	this.name = name;
      	this.gender = gender;
        this.job = job;
        this.characteristics = characteristics;
		this.username = username;
    }

  	toString(){
    	return "Nom : " + this.name + "Genre: " + this.gender + "job: "+ this.job + "Caracteristiques: " + this.caracteristics + "User: " + this.username;
    }

}