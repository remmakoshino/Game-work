// 判定タイミング（ミリ秒）
export const JUDGMENT = {
  GREAT: 50,   // ±50ms
  GOOD: 100,   // ±100ms
  NORMAL: 150  // ±150ms
}

// スコア
export const SCORE = {
  GREAT: 100,
  GOOD: 50,
  NORMAL: 20,
  MISS: 0
}

// キー設定
export const KEYS = {
  D: 'KeyD',
  F: 'KeyF',
  J: 'KeyJ',
  K: 'KeyK'
}

export const LANES = {
  0: { key: 'KeyD', color: '#FF6B6B', position: -1.5 },
  1: { key: 'KeyF', color: '#4ECDC4', position: -0.5 },
  2: { key: 'KeyJ', color: '#FFE66D', position: 0.5 },
  3: { key: 'KeyK', color: '#95E1D3', position: 1.5 }
}

// ゲーム設定
export const GAME_CONFIG = {
  NOTE_SPEED: 5,        // ノーツの落下速度
  SPAWN_DISTANCE: 20,   // ノーツの出現位置
  JUDGMENT_LINE_Y: -8,  // 判定ラインのY座標
  NOTE_SIZE: 0.8        // ノーツのサイズ
}
