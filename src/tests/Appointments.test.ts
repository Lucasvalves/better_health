import request  from "supertest";
import { app } from "../server";


describe('Appointsments Test', ()=>{
	// it('POST Appointments', async()=>{
	// 	const appointsments = {
	// 		patients_id: "01ee07f6-b176-4984-9da0-a51541a90171",
	// 		specialties_id: "02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6",
	// 		doctors_id: "6b4423bb-c816-4dd6-92f5-3a770bd7dea3",
	// 		date: '2024-02-01T12:00:00.123Z',
	// 	}

	// 	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

	// 	const response = await request(app)
	// 	.post('/appointments/')
	// 	.set('Authorization', `Bearer ${token}`)
	// 	.send(appointsments)

	// 	expect(response.status).toBe(201)

	// })

	// it('/GET All Appointments For Range', async()=>{
	// 	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

	// 	const appointments = {
	// 		specialties_id: '02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6',
	// 		range:{
	// 			start:"2024-01-31T01:00:00.123Z",
	// 			end: "2024-02-28T00:00:00.123Z"
	// 		}
	// 	}
	// 	const response = await request(app)
	// 	.get('/appointments/filter')
	// 	.set('Authorization', `Bearer ${token}`)
	// 	.send(appointments)

	// 	expect(response.status).toBe(200)
	// })

	it('/GET All Available ays', async()=>{
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const appointments = {
			date: '2024-02-01T12:00:00.123Z',
			specialties_id: '02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6',
		}
		const response = await request(app)
		.post('/appointments/available-days')
		.set('Authorization', `Bearer ${token}`)
		.send(appointments)

		expect(response.status).toBe(200)
	})
})
