const express = require('express');
const BMIRecord = require('../model/bmimodel');
const { auth } = require('../middleware/auth');
const router = express.Router();
// const BMIRecord = require('../model/BMIRecord'); // Assuming BMIRecord model is defined in this file

// POST calculate BMI
router.post('/calculate',auth, async (req, res) => {
  try {
    const { height, weight } = req.body;
    const userId = req.body.userId; // Extracting user ID from the token or session

    // Check if height and weight are provided in the request body
    if (!height || !weight) {
      return res.status(400).json({ message: 'Height and weight are required' });
    }

    // Calculate BMI using the formula: BMI = weight (kg) / [height (m)]^2
    const heightInMeters = height ; // Convert height from cm to meters
    const bmi = weight / (heightInMeters * heightInMeters);

    // Create a new BMIRecord instance
    const bmiRecord = new BMIRecord({
      userId,
      height,
      weight,
      bmi,
    });

    // Save the BMI record to the database
    await bmiRecord.save();

    // Return the calculated BMI
    return res.json({ bmi });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/history',auth, async (req, res) => {
    try {
      const userId = req.body.userId; // Extracting user ID from the token or session
  
      // Fetch BMI calculation history for the user from the database
      const history = await BMIRecord.find({ userId });
  
      // Return the BMI calculation history
      return res.json(history);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server Error' });
    }
  });

module.exports = router;