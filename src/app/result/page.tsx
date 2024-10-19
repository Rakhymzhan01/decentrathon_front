// pages/result.tsx
"use client"

export default function ResultPage() {
//   const router = useRouter();

//   const restartGame = () => {
//     router.push('/');
//   };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Game Over</h1>
        <p className="mb-6">Thank you for playing!</p>
        <button
        //   onClick={restartGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
