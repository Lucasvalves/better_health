import { Icreate } from "../interfaces/DoctorsInterfaces";
import { DoctorsRepository } from "../repositories/DoctorsRepository";

class DoctorsServices{

	private doctorsRepository : DoctorsRepository

	constructor(){
		this.doctorsRepository = new DoctorsRepository()
	}

	async create({name, crm, specialties, user_id}:Icreate){
		const findDoctor = await this.doctorsRepository.findByCrm(crm)

		if(findDoctor){
			throw new Error("This CRM already exists")
		}

		const result = await this.doctorsRepository.create({name, crm, specialties, user_id})

		return result
	}

}
export { DoctorsServices}
