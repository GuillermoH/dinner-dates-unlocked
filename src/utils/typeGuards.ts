
import { Attendee, EventVisibility } from '@/types';
import { Json } from '@/integrations/supabase/types';

// Type guard to check if a value is an Attendee
export const isAttendee = (value: any): value is Attendee => {
  return typeof value === 'object' && value !== null && 
    'id' in value && 
    'name' in value && 
    'email' in value;
};

// Convert Json array to Attendee array with type safety
export const jsonToAttendees = (json: Json | null): Attendee[] => {
  if (!json || !Array.isArray(json)) return [];
  
  // Use type assertion to unknown first, then filter using type guard
  const unknownArray = json as unknown[];
  return unknownArray.filter(isAttendee);
};

// Type guard to check if a value is a valid EventVisibility
export const isValidVisibility = (value: string): value is EventVisibility => {
  return ['public', 'private', 'community'].includes(value);
};
