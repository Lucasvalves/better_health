
// import  request  from "supertest";
// import { app } from "../server";
// describe('Doctors Test', ()=>{
// 	it('/POST Doctors', async()=>{
// 		const doctor = {
// 			name: 'Gabriela Almeida',
// 			crm: '2009',
// 			specialties_id: '02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6'
// 		}
// 		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

// 		const response = await request(app)
// 		.post('/doctors/')
// 		.set('Authorization', `Bearer ${token}`)
// 		.send(doctor)

// 		expect(response.status).toBe(201)
// 	})

// 	it('/GET All Doctors', async()=>{
// 		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

// 		const response = await request(app)
// 		.get('/doctors/')
// 		.set('Authorization', `Bearer ${token}`)

// 		expect(response.status).toBe(200)
// 	})

// 	it('GET Doctor By Id', async()=>{
// 		const doctor = {
// 			id: '456987cc-8592-4690-a9f0-b126c30de48f'
// 		}

// 		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

// 		const response =  await request(app)
// 		.get(`/doctors/${doctor.id}`)
// 		.set('Authorization', `Bearer ${token}`)

// 		expect(response.status).toBe(200)

// 	})

// 	it('GET Doctor By CRM', async()=>{
// 		const doctor = {
// 			crm: '6093'
// 		}

// 		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

// 		const response =  await request(app)
// 		.get(`/doctors/crm/${doctor.crm}`)
// 		.set('Authorization', `Bearer ${token}`)

// 		expect(response.status).toBe(200)

// 	})

// 	it('DELETE Doctor By Id', async()=>{
// 		const doctor = {
// 			id: '456987cc-8592-4690-a9f0-b126c30de48f'
// 		}

// 		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

// 		const response =  await request(app)
// 		.delete(`/doctors/${doctor.id}`)
// 		.set('Authorization', `Bearer ${token}`)

// 		expect(response.status).toBe(200)

// 	})
// })
