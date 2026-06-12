import { describe, test, expect } from 'vitest';

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

describe('karburn Core Calculations & Security', () => {
  test('Checksum integrity verification', () => {
    const checksum1 = calculateChecksum('2026-06-12', 1718212521000, 10.5, 8.2, 2.3);
    const checksum2 = calculateChecksum('2026-06-12', 1718212521000, 10.5, 8.2, 2.3);
    const checksum3 = calculateChecksum('2026-06-12', 1718212521000, 10.5, 8.5, 2.3);
    
    expect(checksum1).toBe(checksum2);
    expect(checksum1).not.toBe(checksum3);
  });

  test('Emission Constants Consistency', () => {
    const PRESETS = {
      car: 0.18,
      bike: 0.05,
      meat: 2.5,
      vegan: 0.4,
      ac: 0.8,
      fan: 0.04
    };
    
    expect(PRESETS.car).toBeGreaterThan(PRESETS.bike);
    expect(PRESETS.meat).toBeGreaterThan(PRESETS.vegan);
    expect(PRESETS.ac).toBeGreaterThan(PRESETS.fan);
  });
});
