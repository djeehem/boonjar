import express from "express";

import getCoordinatesFromPostalCodeApi from "../utils/postalCode.js";

const router = express.Router();

router.get("/api", getCoordinatesFromPostalCodeApi);


export default router;
