import axios from 'axios';
import { ActivityResponse } from '@/types/activities';

export async function getListActivities(): Promise<ActivityResponse> {
  const { data } = await axios.get<ActivityResponse>('/api/activities/list');
  return data;
} 