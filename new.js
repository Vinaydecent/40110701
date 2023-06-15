var express = require("express");
const app = express();
const moment = require('moment');
const axios = require('axios');
app.get('/trains' ,async (req,res) => {
    try{
    const now = moment();
    const end_time = now.clone().add(12,'hours');

    const response = await axios.get('https://api.jhondoe-railways.com/trains');
    const trainSchedules = response.data;

    const filtertrains = trainSchedules.filter(train => moment(train.departure_time) > now.clone().add(30,'minutes'));
     
    const sortedTrains = filtertrains.sort((a,b) => {
        if(a.price !== b.price)
        {
            return a.price - b.price;

        }
        else if(a.seats_available !== b.seats_available){
            return b.seats_available - a.seats_available;
        }
        else{
            return moment(a.departure_time) - moment(b.departure_time);
        }
    });
    const traindata = sortedTrains.map(train => ({
        train_id:train.train_id,
        departure_time:train.departure_time,
        seats_avail:train.seats_available,
        prices:
        {
            sleeper:train.prices.sleeper,
            AC:train.prices.AC,
        },


    }));
    res.json(traindata);
    }
    catch(error){
        console.error('Failed to retrive train schedules:' ,error);
        res.status(500).json({error:'OOPs! Failed to get the train schedules'});
    }

});
const port = 8000;
app.listen(port, function(){
    console.log("server is running at Port No:" ,port);
});