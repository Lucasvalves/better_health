import multer, { Multer } from "multer";


const upload: Multer = multer({
	storage: multer.memoryStorage(),
	limits: {fileSize: 2 * 1024 * 1024},
});


export {upload};
