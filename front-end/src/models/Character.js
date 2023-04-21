export default class Character{
	constructor(name,gender,job,characteristics,userID){
    	this.name = name;
      	this.gender = gender;
        this.job = job;
        this.characteristics = characteristics;
		this.userID = userID;
    }

  	toString(){
    	return "Nom : " + this.name + "Genre: " + this.gender + "job: "+ this.job + "Caracteristiques: " + this.caracteristics + "User: " + this.userID;
    }

}