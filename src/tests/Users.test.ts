
import request from 'supertest'
import { app } from '../server'

describe('User Test', ()=>{
	it('/POST User', async()=>{
		const user = {
			name: 'Iago Mariano',
			email: 'iagomariano@outlook.com',
			password: '335004'
		}
		const response = await request(app)
		.post('/users')
		.send(user)

		expect(response.status).toBe(201)
	})
	it('Should return 400 when user cannot be created or already exist', async()=>{
		const user = {
			name: 'Iago Mariano',
			email: 'iagomariano@outlook.com',
			password: '335004'
		}
		const response = await request(app)
		.post('/users')
		.send(user)

		expect(response.status).toBe(400)
	})

	it('/AUTH User', async()=>{
		const user = {
			email: 'iagomariano@gmail.com',
			password: '335004'
		}
		const response = await request(app)
		.post('/users/auth')
		.send(user)
		expect(response.status).toBe(200)
	})
	it('/AUTH User. User not exist', async()=>{
		const user = {
			email: 'iagomariano@gmailerrado.com',
			password: '335004'
		}
		const response = await request(app)
		.post('/users/auth')
		.send(user)
		expect(response.status).toBe(400)
	})

	it('PUT User', async () => {
		const user = {
			email: "lucasvelosoalves@gmail.com",
			oldPassword: "lucas1998",
			newPassword: "lucas1998",
		};

		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
			.put('/users/')
			.set('Authorization', `Bearer ${token}`)
			.send(user);

		  expect(response.status).toBe(200);
	});
	it('PUT Should return 400 when user data is incorrect', async () => {
		const user = {
			email: "lucasvelosoalves@gmail.com",
			oldPassword: "lucas199820",
			newPassword: "lucas19",
		};

		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzdmVsb3NvYWx2ZXNAb3V0bG9vay5jb20iLCJpYXQiOjE3MjkwOTA3NjgsImV4cCI6MTc2MDYyNjc2OCwic3ViIjoiNDY2OGQzNjctYzQ2Ni00Y2JjLTljMTYtNmVlM2UwMDMxYmY3In0.4iJ7gEtd4llYl95BzXL1UYkr1khvdamObKTfO-y4bm0';

		const response = await request(app)
			.put('/users/')
			.set('Authorization', `Bearer ${token}`)
			.send(user);

		  expect(response.status).toBe(400);
	});

})


