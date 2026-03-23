import { useState, useEffect } from 'react';

interface Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  length_in_meters: number;
  number_of_corners: number;
  fastest_lap_time: number;
  fastest_lap_driver: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export function useCircuits() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static circuits data - no database
  const staticCircuits: Circuit[] = [
    {
      id: 'zwolle',
      name: 'Zwolle',
      location: 'Zwolle',
      country: 'Nederland',
      length_in_meters: 1200,
      number_of_corners: 12,
      fastest_lap_time: 42.3,
      fastest_lap_driver: 'Max Verstappen',
      description: 'Een technisch circuit in Zwolle',
      image_url: 'https://via.placeholder.com/400x200?text=Zwolle'
    },
    {
      id: 'lelystad',
      name: 'Lelystad',
      location: 'Lelystad',
      country: 'Nederland',
      length_in_meters: 1100,
      number_of_corners: 10,
      fastest_lap_time: 41.8,
      fastest_lap_driver: 'Lewis Hamilton',
      description: 'Een snel circuit in Lelystad',
      image_url: 'https://via.placeholder.com/400x200?text=Lelystad'
    },
    {
      id: 'venray',
      name: 'Venray',
      location: 'Venray',
      country: 'Nederland',
      length_in_meters: 1300,
      number_of_corners: 14,
      fastest_lap_time: 43.1,
      fastest_lap_driver: 'Charles Leclerc',
      description: 'Een uitdagend circuit in Venray',
      image_url: 'https://via.placeholder.com/400x200?text=Venray'
    }
  ];

  // Fetch circuits (static data)
  const fetchCircuits = async (force = false) => {
    try {
      console.log('Fetching static circuits...');
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCircuits(staticCircuits);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching circuits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch circuits');
    } finally {
      setLoading(false);
    }
  };

  // Add new circuit (mock implementation)
  const addCircuit = async (circuit: Omit<Circuit, 'id' | 'created_at'>) => {
    try {
      console.log('Adding circuit:', circuit);
      
      const newCircuit: Circuit = {
        ...circuit,
        id: `circuit-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      setCircuits(prev => [...prev, newCircuit]);
      return newCircuit;
    } catch (err) {
      console.error('Error adding circuit:', err);
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    console.log('useCircuits hook mounted');
    fetchCircuits();
  }, []);

  return {
    circuits,
    loading,
    error,
    fetchCircuits,
    addCircuit
  };
}
