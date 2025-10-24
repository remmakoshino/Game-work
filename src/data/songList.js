import song1Easy from '../charts/song1-easy.json'
import song1Normal from '../charts/song1-normal.json'
import song1Hard from '../charts/song1-hard.json'
import song2Easy from '../charts/song2-easy.json'
import song3Easy from '../charts/song3-easy.json'

export const SONGS = [
  {
    id: 'song1',
    title: '桜色メロディ',
    artist: 'Virtual Singer',
    bpm: 120,
    image: '🌸',
    difficulties: {
      EASY: song1Easy,
      NORMAL: song1Normal,
      HARD: song1Hard
    }
  },
  {
    id: 'song2',
    title: '星空ダンス',
    artist: 'Night Singer',
    bpm: 140,
    image: '⭐',
    difficulties: {
      EASY: song2Easy,
      NORMAL: null,
      HARD: null
    }
  },
  {
    id: 'song3',
    title: '虹色リズム',
    artist: 'Rainbow Voice',
    bpm: 100,
    image: '🌈',
    difficulties: {
      EASY: song3Easy,
      NORMAL: null,
      HARD: null
    }
  }
]

export const DIFFICULTY_COLORS = {
  EASY: '#4ECDC4',
  NORMAL: '#FFE66D',
  HARD: '#FF6B6B'
}
