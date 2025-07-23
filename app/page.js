'use client'
import { useState } from 'react';

const DINNER_ITEMS = [
  { name: 'Protein shake', calories: 120, protein: 24 },
  { name: 'Medium avocado', calories: 234, protein: 3 },
  { name: 'Greek yogurt', calories: 80, protein: 14 },
  { name: 'Corn (1 cob)', calories: 77, protein: 3 },
  { name: 'Boiled egg', calories: 68, protein: 6 },
  { name: 'Mixed veggies', calories: 50, protein: 2 },
];

export default function Home() {
  const [selectedDinner, setSelectedDinner] = useState([]);
  const [lunchText, setLunchText] = useState('');
  const [lunchResult, setLunchResult] = useState({ calories: 0, protein: 0 });
  const [loading, setLoading] = useState(false);

  const toggleDinnerItem = (item) => {
    setSelectedDinner((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const getLunchCalories = async () => {
    setLoading(true);
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: lunchText }),
    });
    const data = await res.json();
    setLunchResult(data);
    setLoading(false);
  };

  const totalDinnerCalories = selectedDinner.reduce(
    (sum, name) => sum + (DINNER_ITEMS.find((i) => i.name === name)?.calories || 0),
    0
  );
  const totalDinnerProtein = selectedDinner.reduce(
    (sum, name) => sum + (DINNER_ITEMS.find((i) => i.name === name)?.protein || 0),
    0
  );

  const totalCalories = totalDinnerCalories + lunchResult.calories;
  const totalProtein = totalDinnerProtein + lunchResult.protein;

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Calorie Tracker</h1>

      <h2>Dinner</h2>
      {DINNER_ITEMS.map((item) => (
        <label key={item.name} style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={selectedDinner.includes(item.name)}
            onChange={() => toggleDinnerItem(item.name)}
          />
          {item.name} - {item.calories} kcal, {item.protein}g protein
        </label>
      ))}

      <h2 style={{ marginTop: 20 }}>Lunch</h2>
      <textarea
        rows={3}
        style={{ width: '100%', marginBottom: 10 }}
        value={lunchText}
        onChange={(e) => setLunchText(e.target.value)}
        placeholder="e.g. Chicken biryani and raita"
      />
      <button onClick={getLunchCalories} disabled={loading}>
        {loading ? 'Loading...' : 'Get Calories'}
      </button>

      {lunchResult.calories > 0 && (
        <p>
          Lunch: {lunchResult.calories} kcal, {lunchResult.protein}g protein
        </p>
      )}

      <h2>Total</h2>
      <p>
        {totalCalories} kcal total, {totalProtein}g protein
      </p>
    </main>
  );
}
