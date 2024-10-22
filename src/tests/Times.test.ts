import request from 'supertest'
import { app } from '../server'
describe('Times Test', ()=>{
	it('/POST Times', async()=>{
		const times = {
			days: 4,
			startHour: '2024-02-01T00:00:00.123Z',
			endHour: '2024-01-31T01:00:00.123Z',
			specialties_id: '02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6',
			doctors_id: '6b4423bb-c816-4dd6-92f5-3a770bd7dea3',
		}
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
		.post('/times/')
		.set('Authorization', `Bearer ${token}`)
		.send(times)

		expect(response.status).toBe(201)

	})

	it('/GET All Times', async()=>{
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
		.get('/times/')
		.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(200)
	})


	it('GET Time By Specialties Id', async()=>{
		const specialties_id = '02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6'

		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response =  await request(app)
		.get(`/times/${specialties_id}`)
		.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(200)
	})
		it('DELETE Time By Id', async()=>{
		const time_id = '195b4a11-4d62-4a87-ad5b-a5e51a1ad422'


		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response =  await request(app)
		.delete(`/times/${time_id}`)
		.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(200)

	})

})

