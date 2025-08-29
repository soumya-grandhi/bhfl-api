const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Replace with your details
const FULL_NAME = "john_doe";
const DOB = "17091999"; // ddmmyyyy
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

// Utility: alternating caps
function toAlternatingCaps(str) {
  let result = "";
  let upper = true;
  for (let i = 0; i < str.length; i++) {
    if (/[a-zA-Z]/.test(str[i])) {
      result += upper ? str[i].toUpperCase() : str[i].toLowerCase();
      upper = !upper;
    } else {
      result += str[i];
    }
  }
  return result;
}

// POST /bfhl
app.post("/bfhl", (req, res) => {
  try {
    const inputData = req.body.data;

    if (!Array.isArray(inputData)) {
      return res.status(400).json({ is_success: false, message: "Invalid input" });
    }

    let oddNumbers = [];
    let evenNumbers = [];
    let alphabets = [];
    let specialChars = [];
    let sum = 0;

    inputData.forEach(item => {
      if (/^-?\d+$/.test(item)) {
        // number
        let num = parseInt(item);
        if (num % 2 === 0) {
          evenNumbers.push(item);
        } else {
          oddNumbers.push(item);
        }
        sum += num;
      } else if (/^[a-zA-Z]+$/.test(item)) {
        // alphabets
        alphabets.push(item.toUpperCase());
      } else {
        // special characters
        specialChars.push(item);
      }
    });

    // For concat_string → collect all alphabets in original order, reverse, then alternating caps
    const letters = inputData.filter(x => /^[a-zA-Z]+$/.test(x)).join("");
    const reversed = letters.split("").reverse().join("");
    const concatString = toAlternatingCaps(reversed);

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets: alphabets,
      special_characters: specialChars,
      sum: sum.toString(),
      concat_string: concatString
    });

  } catch (error) {
    res.status(500).json({ is_success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
