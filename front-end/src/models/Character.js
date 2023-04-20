export default class Character{
	constructor(name,gender,job,characteristics){
    	this.name = name;
      	this.gender = gender;
        this.job = job;
        this.characteristics = characteristics;
    }

  	toString(){
    	return "Nom : " + this.name + "Genre: " + this.gender + "job: "+ this.job + "Caracteristiques: " + this.caracteristics;
    }
}