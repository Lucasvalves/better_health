import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
	definition: {
		info: {
			title: 'Better Health Documentation',
			version: '1.0.0',
			contact: {
				name: "Lucas Veloso",
				email: "lucasvelosoalves@outlook.com",
				url: "https://lucasvelosodev.com.br/"
			}
		}
	},
	apis: ['**/*.ts'],
}

export const SwaggerSpec = swaggerJSDoc(options)
