import { Request, Response } from "express";
import { connection } from "../config/db_config";
import { v4 as uuidv4 } from 'uuid';


// Function fetch all cities OR some cities start

const getCities = (req: Request, res: Response) => {
    
    try{

        const { search } = req.query;
        const searchTerm = typeof search === 'string' ? `%${search}%` : '%'

        const sql = `SELECT * FROM city WHERE cityName LIKE ? ORDER BY cityName ASC`

        connection.query(sql, [searchTerm], (err, result) =>{
            if(err) return res.status(500).json({ message: 'Database error' })

            console.log("Succesfully Fetched Cities")
            console.log('====================================')

            res.send(result);
        })

    }catch (error){
        console.log('Failed to fetch a city/cities', error)
        res.status(500).json({ error: "Failed to fetch a city/cities"})
    }
}

// Function fetch all cities OR some cities end

// Function create new city start

const createCity = (req: Request, res: Response) => {

    try{   

        const { cityName, count } = req.body;
        const uuid = uuidv4();
        
        const sql = "INSERT INTO city (uuid, cityName, count) VALUES (?, ?, ?)"

        connection.query(sql, [uuid, cityName, count], (err) => {
            if (err) return res.status(500).json({ error: "Failed to add city" })

            console.log("Succesfully added a City")
            console.log('====================================')

            res.status(201).json({ message: "City added successfully" })
        })

    }catch (error){
        console.log('Failed to create a city', error)
        res.status(500).json({ error: "Failed to create a city"})
    }

}

// Function create new city end

// Function update city start

const updateCity = (req: Request, res: Response) => {

    try{

        const { uuid } = req.params;
        const { cityName, count } = req.body;

        const sql = "UPDATE city SET cityName = ?, count = ? WHERE uuid = ?";

        connection.query(sql, [cityName, count, uuid], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update city" })

            console.log("Succesfully updated a City")
            console.log('====================================')

            res.status(200).json({ message: "City updated successfully" })
        })

    }catch (error){
        console.log('Failed to update a city', error)
        res.status(500).json({ error: "Failed to update a city"})
    }
}


// Function update city end

// Function delete city start

const deleteCity = (req: Request, res: Response) => {

    try {

        const { uuid } = req.params;

        const sql = "DELETE FROM city WHERE uuid = ?"

        connection.query(sql, [uuid], (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete city" })

            console.log("Succesfully deleted a City")
            console.log('====================================')

            res.status(200).json({ message: "City deleted successfully" })
        })

    }catch (error){
        console.log('Failed to delete a city', error)
        res.status(500).json({ error: "Failed to delete a city"})
    }
}

// Function delete city end



export {getCities, createCity, updateCity, deleteCity}