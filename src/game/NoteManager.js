import { GAME_CONFIG } from '../utils/constants'

export class NoteManager {
  constructor(chartData) {
    this.chartData = chartData
    this.activeNotes = []
    this.currentTime = 0
    this.noteIndex = 0
  }

  update(deltaTime, currentTime) {
    this.currentTime = currentTime

    // 新しいノーツの生成
    while (
      this.noteIndex < this.chartData.notes.length &&
      this.chartData.notes[this.noteIndex].time <= currentTime + 2000
    ) {
      const noteData = this.chartData.notes[this.noteIndex]
      this.activeNotes.push({
        id: this.noteIndex,
        lane: noteData.lane,
        time: noteData.time,
        y: GAME_CONFIG.SPAWN_DISTANCE,
        hit: false
      })
      this.noteIndex++
    }

    // ノーツの位置更新
    this.activeNotes = this.activeNotes.filter(note => {
      if (!note.hit) {
        const timeUntilHit = (note.time - currentTime) / 1000
        note.y = GAME_CONFIG.JUDGMENT_LINE_Y + timeUntilHit * GAME_CONFIG.NOTE_SPEED
        return note.y > GAME_CONFIG.JUDGMENT_LINE_Y - 2
      }
      return false
    })

    return this.activeNotes
  }

  hitNote(lane) {
    const targetNotes = this.activeNotes
      .filter(note => note.lane === lane && !note.hit)
      .sort((a, b) => Math.abs(a.y - GAME_CONFIG.JUDGMENT_LINE_Y) - Math.abs(b.y - GAME_CONFIG.JUDGMENT_LINE_Y))

    if (targetNotes.length > 0) {
      const note = targetNotes[0]
      const timingError = (note.time - this.currentTime)
      note.hit = true
      return { found: true, timingError, noteId: note.id }
    }

    return { found: false }
  }

  reset() {
    this.activeNotes = []
    this.noteIndex = 0
    this.currentTime = 0
  }
}
