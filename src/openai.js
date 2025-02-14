export async function getAIMove(validMoves, squares, lastMoveIndex, gameSize, currentMove) {
    try {
        const response = await fetch("http://localhost:5000/get-ai-move", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ validMoves, squares, lastMoveIndex, gameSize, currentMove }),
        });

        const data = await response.json();
        if (data.error) {
            console.error("AI error:", data.error);
            return null;
        }
        return data.move;
    } catch (error) {
        console.error("Error fetching AI move:", error);
        return null;
    }
}
