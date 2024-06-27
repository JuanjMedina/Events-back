// Paso 1: Definir la interfaz
export interface UpdateEvent {
  title?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  organizer?: string;
  participants?: string[]; // Add the participants property
}
