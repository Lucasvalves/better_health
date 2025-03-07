import  request  from "supertest";
import { app } from "../server";


describe('Specialties Test', ()=>{
	it('/Post Specialties', async()=>{
		const specialtie = {
			name: 'Dermatologista',
		}

		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
		.post('/specialties/')
		.set('Authorization', `Bearer ${token}`)
		.send(specialtie)

		expect(response.status).toBe(201)

	})
		it('/Post Specialtie. Specialtie Already Exists', async()=>{
		const specialtie = {
			name: 'Dermatologista',
		}

		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
		.post('/specialties/')
		.set('Authorization', `Bearer ${token}`)
		.send(specialtie)

		expect(response.status).toBe(400)

	})

	it('GET/ All Specialties', async() =>{
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
		.get('/specialties/')
		.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(200)
	})

	it('GET/ All Specialties. Token Unauthorized', async() =>{
		const token = 'testeeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
		.get('/specialties/')
		.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(200)
	})
	it('GET/ Specialtie By ID', async() =>{

		const specialtie_id = '02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6'
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
		.get(`/specialties/${specialtie_id}`)
		.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(200)
	})
	it('GET/ Specialtie By ID. Specialtie Not Found', async() =>{

		const specialtie_id = '02d6b88f-8c1d-4da5-b4ac-1945d5b9c32020'
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
		.get(`/specialties/${specialtie_id}`)
		.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(400)
	})

})
