export default class Character{

	constructor(name,gender,job,caracteristics){
    	this.name = name;
      	this.gender = gender;
        this.job = job;
        this.caracteristics = caracteristics;
    }

  	toString(){
    	return "Nom : " + this.name + "Genre: " + this.gender + "job: "+ this.job + "Caracteristiques: " + this.caracteristics;
    }

}