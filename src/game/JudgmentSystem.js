import { JUDGMENT, SCORE } from '../utils/constants'

export class JudgmentSystem {
  constructor() {
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.judgments = {
      GREAT: 0,
      GOOD: 0,
      NORMAL: 0,
      MISS: 0
    }
  }

  judge(timingError) {
    const absError = Math.abs(timingError)
    let judgment = 'MISS'

    if (absError <= JUDGMENT.GREAT) {
      judgment = 'GREAT'
      this.combo++
    } else if (absError <= JUDGMENT.GOOD) {
      judgment = 'GOOD'
      this.combo++
    } else if (absError <= JUDGMENT.NORMAL) {
      judgment = 'NORMAL'
      this.combo++
    } else {
      judgment = 'MISS'
      this.combo = 0
    }

    this.judgments[judgment]++
    this.score += SCORE[judgment] * (1 + this.combo * 0.01)
    this.maxCombo = Math.max(this.maxCombo, this.combo)

    return {
      judgment,
      combo: this.combo,
      score: Math.floor(this.score)
    }
  }

  reset() {
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.judgments = {
      GREAT: 0,
      GOOD: 0,
      NORMAL: 0,
      MISS: 0
    }
  }

  getResults() {
    return {
      score: Math.floor(this.score),
      maxCombo: this.maxCombo,
      judgments: { ...this.judgments }
    }
  }
}
