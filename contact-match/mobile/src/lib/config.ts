/**
 * Base URL of the contact-match backend.
 *
 * - Android emulator: use http://10.0.2.2:4000 to reach the host machine.
 * - iOS simulator:    http://localhost:4000 works.
 * - Physical device:  use your machine's LAN IP, e.g. http://192.168.1.5:4000
 *
 * Override with the EXPO_PUBLIC_API_URL environment variable.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:4000";
