require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const app = express();
const port = 5000;

app.use(express.json()); // Ensure JSON parsing
app.use(cors()); // Allow frontend requests

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);


app.post("/get-ai-move", async (req, res) => {
    try {
        const { validMoves, squares, lastMoveIndex, gameSize, currentMove } = req.body;

        // ✅ Validate request body to prevent undefined errors
        if (!validMoves || !Array.isArray(validMoves) || validMoves.length === 0) {
            return res.status(400).json({ error: "No valid moves available" });
        }
        if (!squares || !Array.isArray(squares)) {
            return res.status(400).json({ error: "Invalid board data received" });
        }

        const boardState = squares.map((cell) => (cell === null ? "-" : cell)).join("");
        const validMovesString = validMoves.join(", ");
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite-preview-02-05",
        });
        const prompt = `consider I don't need any code, just want resault and just one number between the validMoves. 
        now consider You are an AI playing Tic-Tac-Toe.
        Choose the best move from the validMoves list based on the current board state.
        Your goal is to maximize your chances of winning and block the opponent ("X").
        1- Winning a move is the highest priority.
        2- Blocking an opponent’s winning move is the second priority.
        3- Creating a strategic two-in-a-row setup is also valuable.
        4- Avoid moves that give the opponent an easy advantage.
        5- Prioritize center and corners for strategic positioning.
          Valid moves: [${validMovesString}]
          Current board: [${boardState}]
          Last move index: ${lastMoveIndex}
          Game size: ${gameSize}
          Move number: ${currentMove}.
          Choose the best move from validMoves and return only the move index.
           just return move = `;
        const generationConfig = {
            temperature: 0,
            topP: 0.95,
            topK: 5,
            maxOutputTokens: 128,
            responseMimeType: "text/plain",
        };

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        });
        const response = await result.response;

        const responseText = await response.text();

        if (!responseText) {
            throw new Error("Empty response from Gemini API");
        }

        const match = responseText.match(/move\s*=\s*(\d+)/);

        let extractedMove;

        if (match) {
            extractedMove = parseInt(match[1], 10);
        } else {
            console.log("No move found in response");
        }



        const aiMove = extractedMove;
        console.log(aiMove)

        if (validMoves.includes(aiMove)) {
            return res.json({ move: aiMove });
        }

        // If AI gives an invalid move, fallback to a random valid move
        const fallbackMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        console.warn("AI gave an invalid move, using fallback:", fallbackMove);
        return res.json({ move: fallbackMove });
    } catch (error) {
        console.error("Error with Google API:", error);
        res.status(500).json({ error: "AI move generation failed" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
