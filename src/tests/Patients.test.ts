import request  from "supertest";
import { app } from "../server";


describe('Patients Test', ()=>{
	// it('/POST Patients', async()=>{
	// 	const patient = {
	// 		name: 'Antonio Alves',
	// 		cpf: '64747735534',
	// 		phone: '71981072201'
	// 	}
	// 	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

	// 	const response = await request(app)
	// 	.post('/patients/')
	// 	.set('Authorization', `Bearer ${token}`)
	// 	.send(patient)

	// 	expect(response.status).toBe(201)
	// })
	// it('GET Patient By Id', async()=>{
	// 	const patient = {
	// 		id: '6e60edea-b70e-4abc-b2a4-5557046954f3'
	// 	}

	// 	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

	// 	const response =  await request(app)
	// 	.get(`/patients/${patient.id}`)
	// 	.set('Authorization', `Bearer ${token}`)

	// 	expect(response.status).toBe(200)

	// })

	// it('/GET All Patients', async()=>{
	// 	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

	// 	const response = await request(app)
	// 	.get('/patients/')
	// 	.set('Authorization', `Bearer ${token}`)

	// 	expect(response.status).toBe(200)
	// })
	// it('GET Patient By CPF', async()=>{
	// 	const patient = {
	// 		cpf: '06461740538'
	// 	}

	// 	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

	// 	const response =  await request(app)
	// 	.get(`/patients/cpf/${patient.cpf}`)
	// 	.set('Authorization', `Bearer ${token}`)

	// 	expect(response.status).toBe(200)

	// })
	// it('PUT Patient', async () => {
	// 	const patient = {
	// 		id: '01ee07f6-b176-4984-9da0-a51541a90171',
	// 		name: 'Lucas Luke',
	// 		cpf: '06461740536',
	// 		phone: '71996579986'
	// 	};

	// 	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

	// 	const response = await request(app)
	// 		.put(`/patients/${patient.id}`)
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send(patient);

	// 	  expect(response.status).toBe(200);
	// });
	// it('DELETE Patient By Id', async()=>{
	// 	const patient = {
	// 		id: '83524c19-03a4-452c-a384-0ea65daf9243'
	// 	}

	// 	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

	// 	const response =  await request(app)
	// 	.delete(`/patients/${patient.id}`)
	// 	.set('Authorization', `Bearer ${token}`)

	// 	expect(response.status).toBe(200)

	// })

})
