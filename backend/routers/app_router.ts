import { Router } from "express";
import { getCities, createCity, updateCity, deleteCity } from "../controllers/app_controller";

const router = Router();

router.get('/cities', getCities)
router.post("/cities", createCity)
router.put("/cities/:uuid", updateCity)  
router.delete("/cities/:uuid", deleteCity)    

export default router