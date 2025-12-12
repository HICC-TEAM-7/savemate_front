import api from './expense';
import { Mission /*, ApiResponse*/ } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const MOCK_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: '커피값 하루 4,000원 이하',
    targetDays: 30,
    achievedDays: 5,
  },
  {
    id: 'm2',
    title: '배달 줄이고 직접 요리',
    targetDays: 30,
    achievedDays: 29,
  },
  { id: 'm3', title: '대중교통 이용', targetDays: 20, achievedDays: 6 },
  { id: 'm4', title: '하루 식비 2만원 이하', targetDays: 20, achievedDays: 10 },
  { id: 'm5', title: '집가고싶다', targetDays: 20, achievedDays: 20 },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getMissions(): Promise<Mission[]> {
  if (USE_MOCK) {
    await delay(200);
    return MOCK_MISSIONS;
  }
  // const { data } = await api.get<ApiResponse<Mission[]>>('/api/v1/missions');
  // return data.data;
  const { data } = await api.get<Mission[]>('/api/v1/missions');
  return data;
}
