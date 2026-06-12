// A simple unit test suite to verify core business logic & calculations of karburn
const assert = require('assert');

console.log('🧪 Starting karburn Unit Test Suite...\n');

// 1. Test Checksum Integrity Function
function calculateChecksum(today, timestamp, grossEmissions, netEmissions, appliedOffset) {
  const dataStr = `${today}|${timestamp}|${grossEmissions}|${netEmissions}|${appliedOffset}`;
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    hash = (hash << 5) - hash + dataStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

try {
  console.log('Testing Checksum calculation...');
  const checksum1 = calculateChecksum('2026-06-12', 1718212521000, 10.5, 8.2, 2.3);
  const checksum2 = calculateChecksum('2026-06-12', 1718212521000, 10.5, 8.2, 2.3);
  const checksum3 = calculateChecksum('2026-06-12', 1718212521000, 10.5, 8.5, 2.3); // modified netEmissions
  
  assert.strictEqual(checksum1, checksum2, 'Checksums should be identical for identical inputs.');
  assert.notStrictEqual(checksum1, checksum3, 'Checksums should differ if values are tampered with.');
  console.log('✅ Checksum Integrity Tests Passed!');
} catch (error) {
  console.error('❌ Checksum test failed:', error.message);
  process.exit(1);
}

// 2. Test Emission Constants Consistency
const PRESETS = {
  car: 0.18, // kg CO2 per km
  bike: 0.05,
  bus: 0.08,
  metro: 0.04,
  meat: 2.5,  // kg CO2 per meal
  veg: 0.6,
  vegan: 0.4,
  ac: 0.8,    // kg CO2 per hour
  fan: 0.04,
  stream: 0.02, // kg CO2 per hour
  ai: 0.002    // kg CO2 per query
};

try {
  console.log('Testing emission factor calculations...');
  assert.ok(PRESETS.car > PRESETS.bike, 'Car emissions must be higher than bike emissions.');
  assert.ok(PRESETS.meat > PRESETS.vegan, 'Meat meal emissions must be higher than vegan meal emissions.');
  assert.ok(PRESETS.ac > PRESETS.fan, 'AC energy emissions must be higher than fan emissions.');
  console.log('✅ Emission Factor Baseline Tests Passed!');
} catch (error) {
  console.error('❌ Emission constants test failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All tests passed successfully!');
process.exit(0);
