import express from 'express';

const router = express.Router();

// ✅ IN-MEMORY STORAGE (persists across requests)
let itineraries = [];  // ✅ REAL DATA STORAGE

router.get('/', async (req, res) => {
  console.log('📂 LOADING itineraries:', itineraries.length);
  res.json(itineraries);  // ✅ RETURNS SAVED DATA
});

router.get('/:id', async (req, res) => {
  const itinerary = itineraries.find(it => it._id === req.params.id);
  if (!itinerary) return res.status(404).json({ error: 'Not found' });
  console.log('📄 LOADED:', itinerary.title);
  res.json(itinerary);
});

router.post('/', async (req, res) => {
  console.log('💾 SAVING stops:', req.body.stops?.length);
  const itinerary = { 
    _id: Date.now().toString(), 
    ...req.body, 
    createdAt: new Date() 
  };
  itineraries.push(itinerary);
  console.log('✅ FULL DATA SAVED:', itinerary.title, 'stops:', itinerary.stops?.length);
  res.status(201).json(itinerary);
});


router.put('/:id', async (req, res) => {
  const index = itineraries.findIndex(it => it._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  console.log('✏️ UPDATING:', req.params.id);
  itineraries[index] = { 
    ...itineraries[index], 
    ...req.body, 
    updatedAt: new Date() 
  };  // ✅ OVERWRITE EXISTING
  res.json(itineraries[index]);
});

router.delete('/:id', async (req, res) => {
  const index = itineraries.findIndex(it => it._id === req.params.id);
  if (index !== -1) itineraries.splice(index, 1);
  console.log('🗑 DELETED:', req.params.id);
  res.json({ success: true });
});

export default router;
